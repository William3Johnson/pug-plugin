const path = require('path');
const Asset = require('./Asset');
const AssetEntry = require('./AssetEntry');
const { scriptStore } = require('./Modules');
const { isWin, pathToPosix } = require('./Utils');

/**
 * @singleton
 */
class AssetScript {
  index = {};

  /**
   * Clear cache.
   * This method is called only once, when the plugin is applied.
   */
  clear() {
    this.index = {};
    scriptStore.clear();
  }

  /**
   * Reset settings.
   * This method is called before each compilation after changes by `webpack serv/watch`.
   */
  reset() {
    this.index = {};
  }

  /**
   * @param {{__isScript?:boolean|undefined, resource:string}} module The Webpack chunk module.
   *    Properties:<br>
   *      __isScript is cached state whether the Webpack module was resolved as JavaScript;<br>
   *      resource is source file of Webpack module.
   *
   * @return {boolean}
   */
  isScript(module) {
    if (module.__isScript == null) {
      let [scriptFile] = module.resource.split('?', 1);
      if (isWin) scriptFile = pathToPosix(scriptFile);
      module.__isScript = scriptStore.has(scriptFile);
    }

    return module.__isScript;
  }

  /**
   * @param {string} file The source file of script.
   * @return {string } Return unique assetFile
   */
  getUniqueName(file) {
    const { name } = path.parse(file);
    let uniqueName = name;

    // the entrypoint name must be unique, if already exists then add an index: `main` => `main.1`, etc.
    if (AssetEntry.isNotUnique(name, file)) {
      if (!this.index[name]) {
        this.index[name] = 1;
      }
      uniqueName = name + '.' + this.index[name]++;
    }

    return uniqueName;
  }

  /**
   * @param {string} issuer The source file of issuer of the required file.
   * @param {string} filename The asset filename of issuer.
   */
  setIssuerFilename(issuer, filename) {
    scriptStore.setIssuerFilename(issuer, filename);
  }

  /**
   * Resolve script file from request.
   *
   * @param {string} request The asset request.
   * @return {string|null} Return null if the request is not a script required in Pug.
   */
  resolveFile(request) {
    const [resource] = request.split('?', 1);
    return scriptStore.has(resource) ? resource : null;
  }

  /**
   * Replace all required source filenames with generating asset filenames.
   * Note: this method must be called in the afterProcessAssets compilation hook.
   *
   * @param {Compilation} compilation The instance of the webpack compilation.
   */
  replaceSourceFilesInCompilation(compilation) {
    const RawSource = compilation.compiler.webpack.sources.RawSource;
    const usedScripts = new Map();
    const realSplitFiles = new Set();
    const allSplitFiles = new Set();

    for (let chunk of compilation.chunks) {
      if (chunk.chunkReason && chunk.chunkReason.startsWith('split chunk')) {
        allSplitFiles.add(...chunk.files);
      }
    }

    // in the content, replace the source script file with the output filename
    for (let asset of scriptStore.getAll()) {
      const issuerFile = asset.issuer.filename;

      if (!compilation.assets.hasOwnProperty(issuerFile)) {
        // let's show an original error
        continue;
      }

      // init script cache by current issuer
      if (!usedScripts.has(issuerFile)) {
        usedScripts.set(issuerFile, new Set());
      }

      const { name, file: sourceFile } = asset;
      const chunkGroup = compilation.namedChunkGroups.get(name);
      if (!chunkGroup) {
        // prevent error when in HMR mode after removing a script in pug
        continue;
      }

      const content = compilation.assets[issuerFile].source();
      let newContent = content;
      let chunkFiles = chunkGroup.getFiles();
      let scriptTags = '';

      chunkFiles = chunkFiles.filter((file) => compilation.assetsInfo.get(file).hotModuleReplacement !== true);

      // replace source filename with asset filename
      if (chunkFiles.length === 1) {
        const chunkFile = chunkFiles.values().next().value;
        const assetFile = Asset.getOutputFile(chunkFile, issuerFile);

        newContent = content.replace(sourceFile, assetFile);
        realSplitFiles.add(chunkFile);
      } else {
        // extract original script tag with all attributes for usage it as template for chunks
        let srcStartPos = content.indexOf(sourceFile);
        let srcEndPos = srcStartPos + sourceFile.length;
        let tagStartPos = srcStartPos;
        let tagEndPos = srcEndPos;
        while (tagStartPos >= 0 && content.charAt(--tagStartPos) !== '<') {}
        tagEndPos = content.indexOf('</script>', tagEndPos) + 9;

        const tmplScriptStart = content.slice(tagStartPos, srcStartPos);
        const tmplScriptEnd = content.slice(srcEndPos, tagEndPos);

        // generate additional scripts of chunks
        const chunkScripts = usedScripts.get(issuerFile);
        for (let chunkFile of chunkFiles) {
          // avoid generate a script of the same split chunk used in different js files required in one pug file,
          // happens when used optimisation.splitChunks
          if (!chunkScripts.has(chunkFile)) {
            const assetFile = Asset.getOutputFile(chunkFile, issuerFile);
            scriptTags += tmplScriptStart + assetFile + tmplScriptEnd;
            chunkScripts.add(chunkFile);
            realSplitFiles.add(chunkFile);
          }
        }

        // inject generated chunks <script> and replace source file with output filename
        if (scriptTags) {
          newContent = content.slice(0, tagStartPos) + scriptTags + content.slice(tagEndPos);
        }
      }

      compilation.assets[issuerFile] = new RawSource(newContent);
    }

    // remove generated unused split files
    for (let file of allSplitFiles) {
      if (!realSplitFiles.has(file)) {
        compilation.deleteAsset(file);
      }
    }
  }
}

module.exports = new AssetScript();

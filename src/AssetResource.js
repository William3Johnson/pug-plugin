const AssetTrash = require('./AssetTrash');
const Resolver = require('./Resolver');

// supports for responsive-loader
const ResponsiveLoader = require('./extras/ResponsiveLoader');

/**
 * @singleton
 */
class AssetResource {
  /**
   * @param {Object} compiler The webpack compiler object.
   */
  init(compiler) {
    // initialize responsible-loader module
    ResponsiveLoader.init(compiler);
  }

  /**
   * @param {Object} module The Webpack module.
   * @param {string} issuer The issuer of module resource.
   */
  render(module, issuer) {
    const { buildInfo, resource } = module;
    const assetFile = buildInfo.filename;
    // try to get asset file processed via responsive-loader
    const asset = ResponsiveLoader.getAsset(module, issuer);

    if (asset != null) {
      Resolver.addResolvedAsset(resource, asset, issuer);

      // save a module and handler for asset that may be used in many styles
      Resolver.setModuleHandler(resource, (originalAssetFile, issuer) => ResponsiveLoader.getAsset(module, issuer));

      // remove original asset filename generated by Webpack, because responsive-loader generates own filename
      AssetTrash.add(assetFile);
      return;
    }

    // save an asset file that may be used in many files
    Resolver.addAsset(resource, assetFile, issuer);
  }
}

module.exports = new AssetResource();

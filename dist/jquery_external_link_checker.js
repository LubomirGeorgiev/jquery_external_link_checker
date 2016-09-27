/**!
 *
 * jQuery External Link Checker v1.0.0
 * http://lubomirgeorgiev.github.io/jquery_external_link_checker/
 *
 *
 * Copyright Lubomir Georgiev <lubomirgeorgievgeorgiev@gmail.com> and other contributors
 * Released under the MIT license
 * http://lubomirgeorgiev.github.io/jquery_external_link_checker/
 *
 */
/**
  The semi-colon before the function invocation is a safety net against
  concatenated scripts and/or other plugins which may not be closed properly.
*/
;(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function(root, jQuery) {
      if (jQuery === undefined) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if (typeof window !== 'undefined') {
          jQuery = require('jquery');
        } else {
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {

  'use strict';

  // window and document are passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = 'checkExternalLinks',
    defaults = {
      externalLinkClass: 'js-external-link',
      internalLinkClass: 'js-internal-link'
    };

  /**
   * The 'Plugin' constructor.
   * @class
   * @namespace js-external-link
   * @public
   * @param {HTMLElement|jQuery} element
   * @param {Object} [options] - The options
  */
  function Plugin(element, options) {
    var _self = this;

    _self.$element = element;

    /**
      jQuery has an extend method which merges the contents of two or
      more objects, storing the result in the first object. The first object
      is generally empty as we don't want to alter the default options for
      future instances of the plugin

      More at: http://api.jquery.com/jquery.extend/
    */
    _self.settings = $.extend(defaults, options);
    _self._defaults = defaults;
    _self._name = pluginName;

    /**
      The 'init' method is the starting point for all plugin logic.
      Calling the init method here in the 'Plugin' constructor function
      allows us to store all methods (including the init method) in the
      plugin's prototype. Storing methods required by the plugin in its
      prototype lowers the memory footprint, as each instance of the
      plugin does not need to duplicate all of the same methods. Rather,
      each instance can inherit the methods from the constructor
      function's prototype.
    */
    _self.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {

    /**
     * Initialization logic.
     * This this method ignites and initializes the whole jQuery plugin
     * @memberof js-external-link
    */
    init: function() {
      var _self = this;

      _self.utilCacheVariables();
      _self.checkLinks();
    },

    /**
     * Make the actial link validation and put the corresponding DOM class on the element
     * @memberof js-external-link
    */
    checkLinks: function() {
      var _self = this;

      var parseCurrentLink = _self.utilParseLink(_self.currentHref);

      if(parseCurrentLink === _self.windowLocationHost) {
        // Internal Link Detected
        $(_self.$element).addClass(_self._defaults.internalLinkClass);
      } else {
        // External Link Detected
        $(_self.$element).addClass(_self._defaults.externalLinkClass);
      }
    },

    /**
     * [Utility] Cache all of the variables that are going to be used extensively in other methods.
     * @memberof js-external-link
    */
    utilCacheVariables: function() {
      var _self = this;

      // Window Cache Variables
      _self.window = window;
      _self.windowLocation = _self.window.location;
      _self.windowLocationHost = _self.windowLocation.host;

      // Plugin util cache variables
      _self.currentHref = $(_self.$element).attr('href').toString();
    },

    /**
     * [Utility] Use browser's native url parser to extract the host from the href. <br>
     * Previously <a href="http://stackoverflow.com/a/21553982">this</a> regex solution was used but there were lots of problems with it. <br>
     * So then I discovered <a href="https://gist.github.com/jlong/2428561">this</a> hack that allowed browser's native url parser to be used and it just works like charm. <br>
     * <strong style="font-size: 130%;">Big round of applause to:  <a href="https://gist.github.com/jlong/2428561">https://gist.github.com/jlong/2428561</a></strong>
     * @memberof js-external-link
    */
    utilParseLink: function(href) {
      var parser = document.createElement('a');
      parser.href = href;

      return parser.host;
    },

    /**
     * Remove plugin instance completely
     * @memberof js-external-link
    */
    destroy: function() {
      /**
          The destroy method unbinds all events for the specific instance
          of the plugin, then removes all plugin data that was stored in
          the plugin instance using jQuery's .removeData method.

          Since we store data for each instance of the plugin in its
          instantiating element using the $.data method (as explained
          in the plugin wrapper below), we can call methods directly on
          the instance outside of the plugin initalization, ie:
          $('selector').data('plugin_myPluginName').someOtherFunction();

          Consequently, the destroy method can be called using:
          $('selector').data('plugin_myPluginName').destroy();
      */
      var _self = this;

      _self.unbindEvents();
      _self.$element.removeData();
    }
  });

  /**
      Create a lightweight plugin wrapper around the 'Plugin' constructor,
      preventing against multiple instantiations.

      More at: http://learn.jquery.com/plugins/basic-plugin-creation/
  */
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        /**
          Use '$.data' to save each instance of the plugin in case
          the user wants to modify it. Using '$.data' in this way
          ensures the data is removed when the DOM element(s) are
          removed via jQuery methods, as well as when the userleaves
          the page. It's a smart way to prevent memory leaks.

          More at: http://api.jquery.com/jquery.data/
        */
        $.data(this, 'plugin_' +
          pluginName, new Plugin(this, options));
      }
    });
  };


}));

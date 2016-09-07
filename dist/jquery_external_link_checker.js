/*!
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
/*
    The semi-colon before the function invocation is a safety net against
    concatenated scripts and/or other plugins which may not be closed properly.

    'undefined' is used because the undefined global variable in ECMAScript 3
    is mutable (ie. it can be changed by someone else). Because we don't pass a
    value to undefined when the anonymyous function is invoked, we ensure that
    undefined is truly undefined. Note, in ECMAScript 5 undefined can no
    longer be modified.

    'window' and 'document' are passed as local variables rather than global.
    This (slightly) quickens the resolution process.
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

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = 'checkExternalLinks',
    defaults = {
      externalLinkClass: 'js-external-link',
      internalLinkClass: 'js-internal-link'
    };

  /*
    The 'Plugin' constructor, builds a new instance of the plugin for the
    DOM node(s) that the plugin is called on. For example,
    '$('h1').pluginName();' creates a new instance of pluginName for
    all h1's.
  */
  // Create the plugin constructor
  function Plugin(element, options) {
    /*
     Provide local access to the DOM node(s) that called the plugin,
     as well local access to the plugin name and default options.
   */
    this.$element = element;

    /*
      jQuery has an extend method which merges the contents of two or
      more objects, storing the result in the first object. The first object
      is generally empty as we don't want to alter the default options for
      future instances of the plugin

      More at: http://api.jquery.com/jquery.extend/
    */
    this.settings = $.extend(defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    /*
      The 'init' method is the starting point for all plugin logic.
      Calling the init method here in the 'Plugin' constructor function
      allows us to store all methods (including the init method) in the
      plugin's prototype. Storing methods required by the plugin in its
      prototype lowers the memory footprint, as each instance of the
      plugin does not need to duplicate all of the same methods. Rather,
      each instance can inherit the methods from the constructor
      function's prototype.
    */
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {

    // Initialization logic
    init: function() {
      /*
        Place initialization logic here
        Note that here you already have acccess to the DOM node(s), plugin name,
        default plugin options and custom plugin options for a each instance
        of the plugin by using the variables 'this.$element',
        'this._name', 'this._defaults' and 'this.options' created in
        the 'Plugin' constructor function.

        Calling function: this.myFunction(arg1, arg2), this.buildCache();
      */
      var _self = this;
      this.utilityCacheVariables();

      this.checkLinks();
    },

    checkLinks: function() {
      var _self = this;

      var parseCurrentLink = _self.utilityParseLink(_self.c_currentHref).host;

      if(parseCurrentLink === _self.c_windowLocationHost) {
        // Internal Link Detected
        $(_self.$element).addClass(_self._defaults.internalLinkClass);
      } else {
        // External Link Detected
        $(_self.$element).addClass(_self._defaults.externalLinkClass);
      }
    },
    utilityCacheVariables: function() {
      /*
        Cache Variables

        Note:
          1. All variables that begin with 'c_' are cache variables
          2. You can access them in other methods like that '_self.c_window'
            or '_self.c_windowLocationHostname'
      */
      var _self = this;

      // Window Cache Variables
      _self.c_window = window;
      _self.c_windowLocation = _self.c_window.location;
      _self.c_windowLocationHref = _self.c_windowLocation.href;
      _self.c_windowLocationHost = _self.c_windowLocation.host;
      _self.c_windowLocationHostname = _self.c_windowLocation.hostname;

      // Plugin utility cache variables
      _self.c_currentHref = $(this.$element).attr('href').toString();
    },
    utilityParseLink: function(href) {
      /*
        Big round of applause to: https://gist.github.com/jlong/2428561
      */
      var _self = this;

      var parser = document.createElement('a');
      parser.href = href;

      return {
        protocol: parser.protocol,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        hash: parser.hash,
        host: parser.host
      };
    },
    // Remove plugin instance completely
    destroy: function() {
      /*
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
      this.unbindEvents();
      this.$element.removeData();
    }
  });

  /*
      Create a lightweight plugin wrapper around the 'Plugin' constructor,
      preventing against multiple instantiations.

      More at: http://learn.jquery.com/plugins/basic-plugin-creation/
  */
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        /*
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

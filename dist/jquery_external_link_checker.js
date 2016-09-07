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
;(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = function(root, jQuery) {
      if (jQuery === undefined) {
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
    factory(jQuery);
  }
}(function($) {

  'use strict';


  var pluginName = 'checkExternalLinks',
    defaults = {
      externalLinkClass: 'js-external-link',
      internalLinkClass: 'js-internal-link'
    };

  function Plugin(element, options) {
    var _self = this;

    _self.$element = element;

    _self.settings = $.extend(defaults, options);
    _self._defaults = defaults;
    _self._name = pluginName;

    _self.init();
  }

  $.extend(Plugin.prototype, {

    init: function() {
      var _self = this;

      _self.utilityCacheVariables();
      _self.checkLinks();
    },

    checkLinks: function() {
      var _self = this;

      var parseCurrentLink = _self.utilityParseLink(_self.c_currentHref);

      if(parseCurrentLink === _self.c_windowLocationHost) {
        $(_self.$element).addClass(_self._defaults.internalLinkClass);
      } else {
        $(_self.$element).addClass(_self._defaults.externalLinkClass);
      }
    },
    utilityCacheVariables: function() {
      var _self = this;

      _self.c_window = window;
      _self.c_windowLocation = _self.c_window.location;
      _self.c_windowLocationHost = _self.c_windowLocation.host;

      _self.c_currentHref = $(_self.$element).attr('href').toString();
    },
    utilityParseLink: function(href) {
      var parser = document.createElement('a');
      parser.href = href;

      return parser.host;
    },
    destroy: function() {
      var _self = this;

      _self.unbindEvents();
      _self.$element.removeData();
    }
  });

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' +
          pluginName, new Plugin(this, options));
      }
    });
  };


}));

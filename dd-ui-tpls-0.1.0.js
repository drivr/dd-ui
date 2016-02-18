/*
 * dd-ui
 * http://clickataxi.github.io/dd-ui/

 * Version: 0.1.0 - 2014-09-05
 * License: MIT
 */
angular.module("dd.ui", ["dd.ui.tpls", "dd.ui.busy-element","dd.ui.validation.phone","dd.ui.validation.sameAs","dd.ui.validation"]);
angular.module("dd.ui.tpls", ["template/busy-element/busy-element.html"]);
angular.module('dd.ui.busy-element', [])

.directive('busyElement', ['$parse', '$timeout', '$rootScope', function ($parse, $timeout, $rootScope) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl:'template/busy-element/busy-element.html',
        scope: {
            busy: '=',
            status: '=',
            timeout: '='
        },
        link: function (scope, element, attr) {
          updateSize();

            scope.$watch('status', function() {
                updateSize();
                if (scope.status != null) {
                    scope.busy = false;
                    scope.statusClass = scope.status;

                    if (scope.timeout !== 0) {
                        $timeout(function(){
                            scope.status = null;
                        }, scope.timeout ? $scope.timeout : 500);
                    }
                }
            });

            function updateSize() {
                scope.width = element.parent().innerWidth();
                scope.height = element.parent().innerHeight();
                scope.marginLeft = element.parent().css('padding-left');
                scope.marginTop = element.parent().css('padding-top');
            }
        }
    };
}]);
var PHONE_REGEXP = /^\+\d{10,14}$/;
var PHONE_COUNTRY_CODE_REGEXP = /^\+\d{1,3}$/;
var PHONE_WO_COUNTRY_CODE_REGEXP = /^\d{7,13}$/;
angular.module('dd.ui.validation.phone', [])

// directive to validate phone number with country code
.directive('phone', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$parsers.unshift(validate);
            ctrl.$formatters.unshift(validate);

            function validate(viewValue) {
                if (!viewValue && viewValue !== '') {
                    return viewValue;
                }

                if (viewValue === '' || PHONE_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('phone', true);
                } else {
                    ctrl.$setValidity('phone', false);
                }
                return viewValue;
            }
        }
    };
})

// directive to validate phone number country code only
.directive('phoneCountryCode', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$parsers.unshift(validate);
            ctrl.$formatters.unshift(validate);

            function validate(viewValue) {
                if (!viewValue && viewValue !== '') {
                    return viewValue;
                }

                if (viewValue === '' || PHONE_COUNTRY_CODE_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('phoneCountryCode', true);
                } else {
                    ctrl.$setValidity('phoneCountryCode', false);
                }
                return viewValue;
            }
        }
    };
})

// directive to validate phone number without country code
.directive('phoneWoCountryCode', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$parsers.unshift(validate);
            ctrl.$formatters.unshift(validate);

            function validate(viewValue) {
                if (!viewValue && viewValue !== '') {
                    return viewValue;
                }

                if (viewValue === '' || PHONE_WO_COUNTRY_CODE_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('phoneWoCountryCode', true);
                } else {
                    ctrl.$setValidity('phoneWoCountryCode', false);
                }
                return viewValue;
            }
        }
    };
});

// copy-paste from http://jsfiddle.net/jaredwilli/77NLB/

angular.module('dd.ui.validation.sameAs', [])

.directive('sameAs', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {

      ctrl.$parsers.unshift(validate);
      ctrl.$formatters.unshift(validate);

      scope.$watch('sameAs', function() {
        validate(ctrl.$modelValue);
      });

      function validate(viewValue) {
        var eth = scope.sameAs;

        if (!eth) {
          return viewValue;
        }

        if (viewValue === eth) {
          ctrl.$setValidity('sameAs', true);
          return viewValue;
        } else {
          ctrl.$setValidity('sameAs', false);
          return undefined;
        }
      }
    },
    scope: {
      sameAs: '='
    }
  };
});

angular.module('dd.ui.validation', ['dd.ui.validation.phone', 'dd.ui.validation.sameAs']);

angular.module("template/busy-element/busy-element.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/busy-element/busy-element.html",
    "<div class=\"be-container\" style=\"margin-left: -{{ marginLeft }}; margin-top: -{{ marginTop }}\">\n" +
    "<style>\n" +
    ".be-container {\n" +
    "    position: absolute;\n" +
    "    z-index: 1;\n" +
    "}\n" +
    "\n" +
    ".be-overlay {\n" +
    "    background-color: rgba(255, 255, 255, 0.7);\n" +
    "    text-align: center;\n" +
    "}\n" +
    "\n" +
    ".be-overlay.success {\n" +
    "    background-color: rgba(0, 128, 0, 0.15);\n" +
    "}\n" +
    "\n" +
    ".be-overlay.fail {\n" +
    "    background-color: rgba(128, 0, 0, 0.15);\n" +
    "}\n" +
    "\n" +
    ".be-animate {\n" +
    "    -webkit-transition:opacity 0.5s;\n" +
    "    transition:opacity 0.5s;\n" +
    "    opacity:1;\n" +
    "}\n" +
    "\n" +
    ".be-animate.ng-hide-add, .be-animate.ng-hide-remove {\n" +
    "    display: block !important;\n" +
    "}\n" +
    ".be-animate.ng-hide {\n" +
    "    opacity:0;\n" +
    "}\n" +
    "</style>\n" +
    "    <div class=\"be-overlay\" ng-show=\"busy\" style=\"width: {{ width }}px; height: {{ height }}px; line-height: {{ height }}px\">\n" +
    "        <img src=\"https://drivr.com/img/spinner.gif\" />\n" +
    "    </div>\n" +
    "    <div class=\"be-overlay be-animate\" ng-show=\"status\" ng-class=\"statusClass\" style=\"width: {{ width }}px; height: {{ height }}px\"></div>\n" +
    "</div>");
}]);
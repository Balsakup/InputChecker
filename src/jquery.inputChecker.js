(function ($) {

    $.fn.inputChecker = function (options) {
        var defaults     = {
            inputParent   : '.input-parent',
            errorClass    : 'error',
            successClass  : 'success',
            helpBlockClass: 'help-block',
            inputEvents   : [ 'change' ],
            onSuccess     : null,
            onError       : null,
            onTest        : null
        };
        var parameters   = $.extend({}, defaults, options);

        var InputChecker = function (parameters) {
            this.check         = function (input) {
                if (input.data('ic-rules') == undefined) {
                    return false;
                }

                this.removeError(input);
                this.removeSuccess(input);

                var rules  = input.data('ic-rules').split('|');
                var value  = input.val();

                if (rules.indexOf('notempty') > -1 && value == '') {
                     return this.addError(input);
                }

                if (rules.indexOf('numeric') > -1) {
                    var regex = new RegExp('^[0-9]*$');

                    if (!regex.test(value)) {
                        return this.addError(input);
                    }
                }

                if (this.indexOf(rules, 'length') > -1) {
                    var rule   = rules[this.indexOf(rules, 'length')];
                    var length = parseInt(rule.split('-')[1]);

                    if (value.length != length) {
                        return this.addError(input);
                    }
                }

                if (this.indexOf(rules, 'min') > -1) {
                    var rule = rules[this.indexOf(rules, 'min')];
                    var min  = parseInt(rule.split('-')[1]);

                    if (value.length < min) {
                        return this.addError(input);
                    }
                }

                if (this.indexOf(rules, 'max') > -1) {
                    var rule = rules[this.indexOf(rules, 'max')];
                    var max  = parseInt(rule.split('-')[1]);

                    if (value.length > max) {
                        return this.addError(input);
                    }
                }

                return true;
            };
            this.removeError   = function (input) {
                var parent = input.parents(parameters.inputParent);

                parent.removeClass(parameters.errorClass);
                parent.find('.' + parameters.helpBlockClass).remove();
            };
            this.addError      = function (input) {
                var parent = input.parents(parameters.inputParent);

                this.removeError(input);
                parent.addClass(parameters.errorClass);
                parent.append($('<span />', {
                    class: parameters.helpBlockClass,
                    html : input.data('ic-message')
                }));
                return false;
            };
            this.removeSuccess = function (input) {
                var parent = input.parents(parameters.inputParent);

                parent.removeClass(parameters.successClass);
                parent.find('.' + parameters.helpBlockClass).remove();
            };
            this.addSuccess    = function (input) {
                var parent = input.parents(parameters.inputParent);

                this.removeSuccess(input);
                parent.addClass(parameters.successClass);
                parent.append($('<span />', {
                    class: parameters.helpBlockClass,
                    html : 'Le teste est valide'
                }));
                return true;
            };
            this.indexOf       = function (array, search) {
                var key = -1;

                $.each(array, function (k, v) {
                    if (v.indexOf(search) > -1) {
                        key = k
                        return;
                    }
                });

                return key;
            };
            this.test        = function (input) {
                var self   = this;
                var result = false;

                $.ajax({
                    url    : input.data('ic-test').replace('$value', input.val()),
                    type   : 'GET',
                    async  : false,
                    success: function (response) {
                        if (parameters.onTest != null) {
                            if (!parameters.onTest(response, input.val())) {
                                $('[data-ic-submit]').attr('disabled', '');
                                result = self.addError(input);
                            } else {
                                $('[data-ic-submit]').removeAttr('disabled');
                                result = self.addSuccess(input);
                            }
                        }
                    },
                    error  : function (error) {
                        alert('Fichier de test\n' + error.responseText);
                        result = false;
                    }
                });

                return result;
            };
        };

        return this.each(function () {
            var inputChecker = new InputChecker(parameters);
            var self         = $(this);

            self.find('[data-ic]').each(function () {
                $(this).on(parameters.inputEvents.join(' '), function () {
                    inputChecker.check($(this));
                });
            });

            self.on('submit', function (event) {
                $(this).find('[data-ic]').each(function () {
                    inputChecker.check($(this));
                });

                $(this).find('[data-ic-test]').each(function () {
                    inputChecker.test($(this));
                });

                if (self.find('.' + parameters.errorClass).length > 0) {
                    event.preventDefault();

                    if (parameters.onError != null) {
                        parameters.onError();
                    }
                } else {
                    if (parameters.onSuccess != null) {
                        parameters.onSuccess();
                    }
                }
            });

            self.find('[data-ic-test-btn]').on('click', function (event) {
                event.preventDefault();

                self.find('[data-ic-test]').each(function () {
                    inputChecker.test($(this));
                });
            });
        });
    };

})(jQuery);

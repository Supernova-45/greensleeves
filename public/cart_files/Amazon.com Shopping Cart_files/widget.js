/**
 * @author sumeet
 */
try {
    (function (module) {
        if (module.isRegistered)
            return;
        /** Generic Utility **/
        (function (WlpInjectable) {
            // TODO - Replace it with underscore library later
            var q = 0;
            var utility = {
                isFunction: function (fn) {
                    return typeof fn === 'function';
                },
                isObject: function (n) {
                    var t = typeof n;
                    return 'function' === t || 'object' === t && !!n;
                },
                defer: function (callback) {
                    setTimeout(callback, 0);
                },
                uniqueId: function (n) {
                    var t = ++q + '';
                    return n ? n + t : t;
                },
                isEmpty: function (str) {
                    return !str || (str === '');
                },
                startsWith: function (str, search, rawPos) {
                    if (!String.prototype.startsWith) {
                        var pos = rawPos > 0 ? rawPos | 0 : 0;
                        return str.substring(pos, pos + search.length) === search;
                    } else {
                        return str.startsWith(search);
                    }
                }
            };

            var EnvInfo = function (env) {
                var _data = {}, _self = this;

                /**
                 * @private
                 * current market place locale for the pipeline.
                 */
                var _locale = 'us';
                /**
                 * @public
                 * saves the environment info string
                 */
                this.info = env;
                /**
                 * @public
                 * Returns static root for the application
                 * @return {String}
                 */
                this.inject = function (obj) {
                    _data = obj || _data;
                };
                /**
                 * @public
                 * Returns static root for the application
                 * @return {String}
                 */
                this.getStaticRoot = function () {
                    return (_data.root || {}).static;
                };
                /**
                 * @public
                 * Returns static root URL for the application
                 * @return {String}
                 */
                this.getStaticUrl = function () {
                    return [_self.getStaticRoot(), ('v2')].join('/');
                }
                /**
                 * @public
                 * Returns dynamic root for the application
                 * @return {String}
                 */
                this.getDynamicRoot = function () {
                    return ((_data.domain || {})[_locale]) + (_data.root || {}).dynamic;
                };
                /**
                 * @public
                 * Returns pipeline URL
                 * @return {String}
                 */
                this.getPipelineUrl = function () {
                    return ((_data.domain || {})[_locale] ||
                            'https://www.amazon.com') +
                        '/gp/prime/pipeline/membersignup';
                };

                this.getHorizonteActionsUrl = function () {
                    return ((_data.domain || {})[_locale] ||
                            'https://www.amazon.com') +
                        '/hp/wlp/pipeline/actions';
                };

                this.getDomain = function () {
                    return ((_data.domain || {})[_locale] ||
                        'https://www.amazon.com');
                };

                /**
                 * @public
                 * Returns tranlated pot object
                 * @return {String}
                 */
                this.getPot = function () {
                    return ((_data.pot || {})[_locale]);
                };
            };

            // promote to WlpInjectable name space
            WlpInjectable.EnvInfo = new EnvInfo('PROD');

            // fake the underscore injection
            WlpInjectable._ = utility;
        })(window.WlpInjectable = window.WlpInjectable || {});

        /** Dependency Injector **/
        (function (WlpInjectable, _) {

            /**
             * @private
             * @class Injector
             * Creates Dependency Injection setup class
             */
            var Injector = function () {
                var _self = this;
                var _dependencies = {};

                /**
                 * @public
                 * registers the new dependency injector
                 * @param {String} name dependency name
                 * @param {Object} module dependency object
                 */
                this.register = function (name, module) {
                    if (_.isEmpty(name) ||
                        !_.isObject(module)) return; // not a valid input

                    // add dependency
                    _dependencies[name] = module;
                };

                /**
                 * @public
                 * un-registers the created dependency injector
                 * @param {String} name dependency name
                 */
                this.unRegister = function (name) {
                    if (_.isEmpty(name)) return;
                    // ToDo - add custom log, if you dont have that dependency listed

                    // remove dependency
                    delete _dependencies[name];
                };

                /**
                 * @public
                 * get the registered module dependnecy
                 * @param {String} name dependency name
                 * @return {Object} dependency object
                 */
                this.get = function (name) {
                    return _dependencies[name] || {};
                };
            };

            // promote this class instance globally
            WlpInjectable.DependencyInjector = new Injector();

        })(window.WlpInjectable = window.WlpInjectable || {}, WlpInjectable._);

        /** UI-Factory**/
        P.when('A').execute(
            function (A) {
                var url = 'https://d2h8zr0m6mus4x.cloudfront.net/primesignup/package.json';
                var $ = A.$;
                $.support.cors = true;
                $.ajax({
                    async: false,
                    type: 'GET',
                    cache: false,
                    url: url,
                    crossDomain: true,
                    error: function () {
                    },
                    success: function (data) {
                        WlpInjectable.EnvInfo.inject(data);
                    }
                });

                (function (WlpInjectable, $) {
                    /**
                     * @private
                     * @class UiFactory
                     * Creates UI Factory for injectable widget.
                     * It manages all stuff related to common content and htm & style sheets.
                     */
                    var UiFactory = function () {
                        var uiContainer = $('<div id="uiContainer"></div>');
                        // append to body or known container div, ToDo
                        uiContainer.appendTo('body');

                        /**
                         * @private
                         * create element and insert to DOM
                         * @param {String} eleType element type
                         * @param {Object} attrs custom attributes for the div element
                         * @return {Object} jQ element created
                         */
                        var createEle = function (eleType, attrs) {
                            var random = $('<' + eleType + '>');
                            random.attr(attrs);
                            random.appendTo(uiContainer);
                            return random;
                        };

                        /**
                         * @public
                         * create div element and insert to DOM
                         * @param {Object} attrs custom attributes for the div element
                         * @return {Object} div element
                         */
                        this.createDivEle = function (attrs) {
                            return createEle('div');
                        };

                        /**
                         * @public
                         * create button element and insert to DOM
                         * @param {Object} attrs custom attributes for the div element
                         * @return {Object} button element
                         */
                        this.createButtonEle = function (attrs) {
                            return createEle('button');
                        };

                    };

                    // register to DI
                    WlpInjectable.DependencyInjector.register(
                        'ui-factory',
                        new UiFactory()
                    );
                })(window.WlpInjectable = window.WlpInjectable || {}, A.$);
            }
        );

        /** Modal vs Bottom-Sheet block **/
        P.when('A').execute(function (A) {
            var uiFactory = WlpInjectable.DependencyInjector.get('ui-factory');
            var $ = A.$,
                isMobile = A.capabilities.mobile || false,
                hash = '#prime-modal',
                modalApi = null,
                modalInstance = null,
                moduleRegistered = false;

            var defer = function (callback) {
                setTimeout(callback, 0);
            };

            var setupBackBtnOverride = function (modal) {
                window.onhashchange = function (a, b) {
                    var browsHash = window.location.hash;
                    if (!browsHash || (browsHash && browsHash != hash)) {
                        modal.hide();
                    } else if (browsHash && browsHash == hash) {
                        modal.show();
                    }
                };
            };

            var Modal = function () {
                var _self = this;
                // modal-init-content
                var _popoverPreloadContent =
                    '<div class="a-popover-preload" id="a-popover-usp-wlp-widget-modal">' +
                    '<div id="usp-wlp-popover-content-inner" class="a-scroller a-scroller-vertical">' +
                    '<div style="min-height:100px;" >' +
                    '<div style="margin:50px auto;width:100px;height:100%;text-align: center;">Processing...<br/>' +
                    '<img style="width:100px" src="https://images-na.ssl-images-amazon.com/images/G/01/payments-portal/r1/loading-4x._CB338200758_.gif"></img>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                defer(function () {
                    var ele = $('.a-container').first();
                    // fallback to body
                    if (ele && ele.length == 0)
                        ele = $('body');

                    ele.append($(_popoverPreloadContent));
                });

                var _customModalCloseButton = '<button id="wlp-custom-modal-close-button" data-action="usp-wlp-custom-modal-close-button" class="a-button-close a-declarative" aria-label="Close"><i class="a-icon a-icon-close"></i></button>';

                this.init = function () {
                    if (isMobile) {
                        var height = function () {
                            return window.innerHeight * .8;
                        };

                        //create bottom-sheet
                        var config = {
                            name: 'wlp-injectable-bottom-sheet',
                            preloadDomId: 'usp-wlp-popover-content-inner',
                            height: height(),
                            closeType: 'icon'
                        };
                        modalInstance = modalApi.create(config);
                        /*A.on('a:sheet:beforeShow:wlp-injectable-bottom-sheet', function(e) {
                            e && e.sheet && e.sheet.changeHeight({
                                height: height(),
                                duration: 0
                            });
                        });*/
                        $(window).bind('orientationchange', function () {
                            var s = modalApi.get('wlp-injectable-bottom-sheet');
                            s && s.changeHeight({
                                height: height(),
                                duration: 0
                            });
                        });
                        //setupBackBtnOverride(_self);
                        return;
                    }

                    //create modal
                    var _$modalTrigger = uiFactory.createDivEle({
                        id: 'usp-wlp-widget-modal-trigger'
                    });
                    var modalOptions = {
                        "max-width": "800px",
                        "min-width": "475px",
                        "dataStrategy": "preload",
                        "closeButton": true,
                        "allowScrollOnPage": true,
                        "name": "usp-wlp-widget-modal",
                        "popoverLabel": "Prime Signup Dialog",
                        "hideHeader": true
                        //"header": "Amazon Prime" + _customModalCloseButton,
                        //"footer": ""
                    };
                    modalInstance = modalApi.create(_$modalTrigger, modalOptions);
                    //setupBackBtnOverride(_self);
                };

                this.show = function (repaint) {
                    var enableFullpageRedirect = false;
                    if (enableFullpageRedirect && (/Android/.test(navigator.userAgent))
                        && !(/Mobile/.test(navigator.userAgent))) {

                        var _wlpPipelineBaseUrl = WlpInjectable.EnvInfo.getPipelineUrl();
                        var form = $('<form/>', {
                            action: _wlpPipelineBaseUrl,
                            method: 'POST'
                        }).appendTo('body');

                        $.each(config, function (key, value) {
                            if (value !== undefined) {
                                $('<input>').attr({
                                    type: 'hidden',
                                    name: key,
                                    value: value
                                }).appendTo(form);
                            }
                        });
                        form.submit();
                        return;
                    }
                    ;
                    !isMobile ? modalInstance.lock(12).show() : modalInstance.show();
                    //window.location.hash = hash; // save the hash
                };

                this.hide = function () {
                    !isMobile ? modalInstance.unlock(12).hide() : modalInstance.hide();
                };

                this.update = function (obj) {
                    // not applicable for bottom-sheet
                    if (isMobile) return;
                    obj = obj || {};
                    // set the custom welcome header here without close button, as we want user to click continue
                    modalInstance && modalInstance.update(obj);
                };

                this.formatContent = function (jqEle) {
                    // format bottom-sheet to insert deliberate close button
                    if (isMobile && $('#wlp-custom-modal-close-button').length == 0) {
                        var ele = $(_customModalCloseButton);
                        ele.css('top', '0');
                        ele.css('margin', '0');
                        ele.css('z-index', '999');
                        jqEle.prepend(ele);

                        // supress AUI defect - the focus event closes the modal
                        $('#wlp-custom-modal-close-button').focus(_self.hide);
                    }
                };

                this.destroy = function () {
                };
            };

            if (isMobile) {
                P.when('a-sheet').execute(function (api) {
                    // isMobile = true;
                    modalApi = api;
                    P.now('wlp-injectable-modal').execute(function (injectableModal) {
                        if (injectableModal) {
                            return;
                        }
                        P.register('wlp-injectable-modal', function () {
                            moduleRegistered = true;
                            return new Modal();
                        });
                    });

                });
            } else {
                P.when('a-modal').execute(function (api) {
                    // if (isMobile) return;
                    modalApi = api;

                    if (moduleRegistered) return;
                    P.now('wlp-injectable-modal').execute(function (injectableModal) {
                        if (injectableModal) {
                            return;
                        }
                        P.register('wlp-injectable-modal', function () {
                            moduleRegistered = true;
                            return new Modal();
                        });
                    });
                });
            }
        });

        /** Widget Provider**/
        /*
          This module is required to be exposed as AUI module as this get used in
          other template for dependency injecton.
        */
        P.now("wlp-injectable-widget").execute(function (wlpInjectableWidget) {
            if (wlpInjectableWidget) {
                return;
            }
            P.when('A', 'wlp-injectable-modal', 'usp-wlp-utility').register(
                'wlp-injectable-widget',
                function (A, modal, utility) {
                    var _ = window.WlpInjectable._;
                    var _$ = A.$;

                    var _defer = function (callback) {
                        setTimeout(callback, 0);
                    };

                    //sets the CSM injection flag for the given request
                    var _setCSMInjectionFlag = function (requestParams) {
                        if (requestParams && requestParams.inline && requestParams.inline == "1") {
                            requestParams.disableCSM = window.ue ? 1 : 0;
                        }
                    };

                    // mark the auth-portal display use case
                    var isAuthPortal = false;
                    P.when('wlp-injectable-execute-action').execute(function (a) {
                        isAuthPortal = a.isUnrec ? a.isUnrec() : isAuthPortal;
                    });

                    var _wlpPipelineBaseUrl = WlpInjectable.EnvInfo.getPipelineUrl();
                    modal.init();

                    //ToDo - can we create the modal dynamically using AUI?
                    var errMsg = '<div class="a-box a-alert a-alert-error"><div class="a-box-inner a-alert-container"><h4 class="a-alert-heading">Sorry, we couldn\'t find that page. Please go to another page to join Prime.</h4><i class="a-icon a-icon-alert"></i><div class="a-alert-content"></div></div></div>';

                    var preFetchIdChain = {};

                    // function to serliaze form to JSON data
                    _$.fn.serializeObject = function () {
                        var o = {};
                        var a = this.serializeArray();
                        _$.each(a, function () {
                            if (o[this.name] !== undefined) {
                                if (!o[this.name].push) {
                                    o[this.name] = [o[this.name]];
                                }
                                o[this.name].push(this.value || '');
                            } else {
                                o[this.name] = this.value || '';
                            }
                        });
                        return o;
                    };

                    var _wlpPipelineMetadata = {};
                    var _initializePipelineMetadata = function (input) {
                        _$.extend(true, _wlpPipelineMetadata, input);
                    };

                    //keep the key and value names same
                    var _wlpPipelineMetadataKeys = {
                        ref: "ref",
                        ref_: "ref_",
                        tag: "tag",
                        primeCampaignId: "primeCampaignId",
                        primeCampaignIdPref: "primeCampaignIdPref",
                        redirectURL: "redirectURL",
                        shouldRedirect: "shouldRedirect",
                        redirectQueryParams: "redirectQueryParams",
                        cancelRedirectURL: "cancelRedirectURL",
                        cancelRedirectQueryParams: "cancelRedirectQueryParams",
                        skipWelcomePage: "skipWelcomePage",
                        locationID: "locationID"
                    };

                    var _execute = function (input) {
                        if (!input.async) {
                            input.async = true;
                        }
                        return _$.ajax({
                            url: input.url,
                            type: input.type,
                            //dataType : 'json',
                            data: input.data,
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            async: input.async
                        });
                    };

                    var _loadPipeline = function (data) {
                        var errorResponse = {
                            status: "error"
                        };
                        //prepare data for wlp pipeline
                        var finalPostData = {};

                        _$.each(data, function (key, value) {
                            finalPostData[key] = value;
                        });

                        // Update WLP form post url to horizonte actions in case of horizonte flow.
                        if (finalPostData.isHorizonteFlow) {
                            _wlpPipelineBaseUrl = WlpInjectable.EnvInfo.getHorizonteActionsUrl();
                        } else if (finalPostData.url) {
                            if (_.startsWith(finalPostData.url, "https:") || _.startsWith(finalPostData.url, "http:")) {
                                _wlpPipelineBaseUrl = finalPostData.url;
                            } else {
                                _wlpPipelineBaseUrl = WlpInjectable.EnvInfo.getDomain() + finalPostData.url;
                            }
                        }

                        _setCSMInjectionFlag(finalPostData);
                        // call execute
                        return _execute({
                            url: _wlpPipelineBaseUrl,
                            type: 'POST',
                            data: finalPostData
                        });
                    };

                    var logErrorMetric = function (result) {
                        if (window.ue && ue.tag && window.uex) {
                            ue.tag('PrimeSignupInjectablePipelineFatal', 'primeInjectablePipeline');
                            uex('ld', 'primeInjectablePipeline');
                        }
                    };

                    var showPopUpSpinner = function (config) {
                        modal.update({
                            'closeButton': true
                        });
                        config = config || {};
                        config.msg = config.msg || 'Processing';
                        config.width = config.width || '200px';
                        config.minHeight = config.minHeight || '450px';

                        //declare spinner
                        var spinner =
                            "<div style='margin:50px auto;width:" + config.width + ";height:100%;text-align:center;'>" +
                            config.msg + "...<br/>" +
                            "<img style='width:" + config.width + "' src='https://images-na.ssl-images-amazon.com/images/G/01/payments-portal/r1/loading-4x._CB338200758_.gif'></img>" +
                            "</div>";
                        //set spinner content and trigger spinner in modal
                        A.$('#usp-wlp-popover-content-inner').html("<div style='min-height:" + config.minHeight + ";'>" + spinner + "</div>");
                    };

                    var toggleView = function (state) {
                        var disableIngress = function () {
                            var $buttonContainer = A.$('.prime-signup-ingress');
                            var $button = $buttonContainer.find('button');
                            $buttonContainer.addClass('a-button-disabled');
                            $button.attr('disabled', 'disabled');
                        };
                        switch (state) {
                            case 'thank-you':
                                // set the custom welcome header here without close button, as we want user to click continue
                                modal.update({
                                    'header': 'Welcome to Amazon Prime'
                                });
                                // disable the button, as we don't want further click
                                disableIngress();
                                return;
                            case 'auth-portal':
                                disableIngress();
                                return;
                        }
                    };

                    var _loadPopup = function (input, preFetchId) {
                        _wlpPipelineMetadata.redirectURL = btoa(window.location.href);

                        //validate data
                        if ((typeof input) !== 'object') {
                            throw "Type of input passed is not object";
                        }
                        //initialize pipeline metadata
                        input && _initializePipelineMetadata(input);

                        if (!isAuthPortal) {
                            modal.show();
                        } else {
                            // we don't want to show intermediate modal for unrec customer
                            toggleView('auth-portal');
                        }

                        // GET from Prefetched Content
                        if (preFetchId) {
                            preFetchId = preFetchIdChain[preFetchId] || preFetchId;
                            utility.PreFetchService().get(preFetchId, function (success, result, togglePreFetch) {
                                var toggle = togglePreFetch();
                                if (success) {
                                    // success
                                    if (!result || result.indexOf('USPWLPPipelineLoadedSuccessfully') == -1) {
                                        A.$('#usp-wlp-popover-content-inner').html(errMsg);
                                        // get the new prefetch ID, as we are in 200 with failure response
                                        //preFetchIdChain[preFetchId] = utility.PreFetchService().invalidate(preFetchId, true);
                                        modal.update({
                                            'closeButton': true
                                        });
                                        logErrorMetric(result); // log for metrics
                                    } else {
                                        if (!toggle) {
                                            A.$('#usp-wlp-popover-content-inner').html(result);
                                        }
                                        // dont show close button for success modal
                                        modal.update({
                                            'closeButton': false
                                        });
                                    }
                                } else {
                                    modal.update({
                                        'closeButton': true
                                    });
                                    // failure
                                    A.$('#usp-wlp-popover-content-inner').html(errMsg);
                                    logErrorMetric(result); // log for metrics
                                }

                                // for mobile use case, attach custom close button
                                //modal.formatContent(A.$('#usp-wlp-popover-content-inner'));

                                // already pre-fetched and available on DOM
                                toggle && toggle(true);

                                // notify for execute actions
                                P.when('wlp-injectable-execute-action').execute(function (action) {
                                    action.execute();
                                });

                            });

                            return;
                        }

                        /*Non-Prefetch Case:: get executed for accept offer POST req */
                        showPopUpSpinner({
                            msg: 'Processing',
                            width: '100px',
                            minHeight: '100px'
                        });
                        //call load pipeline with input
                        _loadPipeline(input)
                            .done(function (result) {
                                if (!result || result.indexOf('USPWLPPipelineLoadedSuccessfully') == -1) {
                                    A.$('#usp-wlp-popover-content-inner').html(errMsg);
                                } else {
                                    A.$('#usp-wlp-popover-content-inner').html(result);
                                    modal.update({
                                        'closeButton': false
                                    });
                                }
                            })
                            .fail(function (error) {
                                A.$('#usp-wlp-popover-content-inner').html(errMsg);
                            })
                            .always(function () {
                            });
                    };

                    var _closeModal = function () {
                        modal.hide();
                        A.$('.a-modal-scroller').css('visibility', 'hidden');
                        setTimeout(function () {
                            window.location.hash = '';
                        }, 500);
                        // release from DOM, for non pre-fetch to element case
                        //A.$('#usp-wlp-popover-content-inner').empty();
                    };

                    var _wlpInjectablePipelineActions = {
                        acceptOffer: "acceptOffer",
                        declineOffer: "declineOffer",
                        redirectOnSuccess: "redirectOnSuccess"
                    };
                    var _declineOfferAction = function () {
                        if (_wlpPipelineMetadata && _wlpPipelineMetadata.hasOwnProperty("cancelRedirectURL") &&
                            _wlpPipelineMetadata.cancelRedirectURL && _wlpPipelineMetadata.cancelRedirectURL.trim().length !== 0) {
                            window.location.href = _wlpPipelineMetadata.cancelRedirectURL;
                        } else {
                            _closeModal();
                        }
                        return true;
                    };

                    var _acceptOfferAction = function (data, preFetchId) {
                        _loadPopup(data, preFetchId);
                        return true;
                    };

                    var redirectOnSuccess = function () {
                        if (_wlpPipelineMetadata.shouldRedirect == "false") {
                            location.reload();
                            return false;
                        } else {
                            window.location.href = atob(_wlpPipelineMetadata.redirectURL) || '/gp/prime';
                            return true;
                        }
                    };

                    var _executeAction = function (action, data, preFetchId) {
                        var result = false;
                        switch (action) {
                            case _wlpInjectablePipelineActions.acceptOffer:
                                result = _acceptOfferAction(data, preFetchId);
                                break;
                            case _wlpInjectablePipelineActions.declineOffer:
                                result = _declineOfferAction();
                                break;
                            case _wlpInjectablePipelineActions.redirectOnSuccess:
                                result = redirectOnSuccess();
                                break;
                            default:
                                break;
                        }
                        return result;

                    };

                    // *** DISMISS - MODAL ***
                    A.declarative('usp-wlp-custom-modal-close-button', 'click', _closeModal);
                    A.on('a:popover:dismiss:usp-wlp-widget-modal', _closeModal);

                    var registerPreFetch = function (req, noDomPrefetch) {
                        // get utility
                        var service = utility.PreFetchService();
                        _initializePipelineMetadata(req);

                        // final post data creation: ToDo - IMPROVE IT
                        var errorResponse = {
                            status: "error"
                        };
                        // prepare data for wlp pipeline
                        var finalPostData = {};
                        _$.each(req, function (key, value) {
                            if (key === 'disablePrefetch') return;
                            finalPostData[key] = value;
                        });

                        var obj = {
                            url: _wlpPipelineBaseUrl,
                            contentType: 'text',
                            reqType: 'POST',
                            request: finalPostData,
                            preFetch: !req.disablePrefetch
                        };
                        if (!noDomPrefetch)
                            obj.preFetchEle = A.$('#usp-wlp-popover-content-inner');

                        // register for prefetch
                        var id = service.register(obj);

                        return preFetchIdChain[id] = id;
                    };

                    (function (WlpInjectable) {
                        var WidgetProvider = function (noDomPrefetch) {
                            var _preFetchId;
                            this.registerPreFetch = function (config) {
                                return _preFetchId = registerPreFetch(config, noDomPrefetch);
                            };

                            this.initWidget = function (preFetchId, onInit) {
                                onInit = onInit || function () {
                                };
                                preFetchId = preFetchId || _preFetchId;

                                // call to init the injectable pop-up here
                                onInit(true, function () {
                                    _loadPopup(null, preFetchId);
                                });
                            };
                        };

                        // register to DI
                        WlpInjectable.DependencyInjector.register(
                            'widget-provider',
                            function (noDomPrefetch) {
                                return new WidgetProvider(noDomPrefetch);
                            }
                        );

                    })(window.WlpInjectable = window.WlpInjectable || {});

                    // AUI module return
                    return {
                        load: _loadPopup,
                        executeAction: _executeAction,
                        wlpPipelineMetadataKeys: _wlpPipelineMetadataKeys,
                        closeModal: _closeModal,
                        wlpInjectablePipelineActions: _wlpInjectablePipelineActions,
                        showPopUpSpinner: showPopUpSpinner,
                        toggleView: toggleView,
                        setCSMInjectionParam: _setCSMInjectionFlag
                    };
                }
            );
        });

        /** wlp-utility for pre-fetch **/

        P.now('usp-wlp-utility').execute(function (wlpUtility) {
            if (wlpUtility) {
                return;
            }
            P.when('A').register('usp-wlp-utility', function (A) {

                /**
                 * Added to avoid I.E. error - https://issues.amazon.com/PrimeDSP-1081,
                 * This replaces the global eval method and polyfill array's indexOf method.
                 */
                (function () {
                    // Check if a string has a non-whitespace character in it
                    var rnotwhite = /\S/;
                    var prevGlobalEval = A.$.globalEval;
                    /* A.$.globalEval = function(code) {
                        var script, indirect = eval || window.execScript;

                        code = A.$.trim(code);

                        if (code) {
                            // If the code includes a valid, prologue position
                            // strict mode pragma, execute code by injecting a
                            // script tag into the document.
                            script = document.createElement("script");
                            script.text = code;
                            (document.head || document.getElementsByTagName("head")[0]).appendChild(script).parentNode.removeChild(script);
                            return;
                        }
                    }; */

                    // polyfill indexOf method to support I.E old versions
                    if (!Array.prototype.indexOf) {
                        Array.prototype.indexOf = function (searchElement, fromIndex) {
                            var k;
                            if (this == null) {
                                throw new TypeError('"this" is null or not defined');
                            }
                            var o = Object(this);
                            var len = o.length >>> 0;
                            if (len === 0) {
                                return -1;
                            }
                            var n = +fromIndex || 0;
                            if (Math.abs(n) === Infinity) {
                                n = 0;
                            }
                            if (n >= len) {
                                return -1;
                            }
                            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
                            while (k < len) {
                                if (k in o && o[k] === searchElement) {
                                    return k;
                                }
                                k++;
                            }
                            return -1;
                        };
                    }
                })();

                // utility code block
                (function (WlpInjectable, _, $) {
                    'use strict';

                    /**
                     * WlpInjectable
                     * @namespace
                     */

                    /**
                     * @private
                     * @class Cache
                     * Creates a new cache instance.
                     * @param {Object} config object that wraps all configurable property for the cache
                     */
                    var Cache = function (config) {
                        config = config || {};
                        var _url = config.url,
                            _contentType = config.contentType,
                            _request = config.request,
                            _preFetch = !!config.preFetch,
                            _id, _data,
                            _self = this;

                        var _subs = [];
                        var _notify = function (success) {
                            $.each(_subs, function (i, sub) {
                                _.isFunction(sub) &&
                                sub(success, _data, _preFecthEleToggle);
                            });

                            _subs = []; // reset
                        };

                        // pre-fetch if requested
                        _.defer(function () {
                            if (_preFetch) {
                                _self.getData(function (success, data) {
                                    success && (_data = data);
                                });
                            }
                        });

                        // toggle Pre-Fetch Element
                        var _preFecthEleToggle = function () {
                            if (!config.preFetchEle) return;
                            return function (toggle) {
                                toggle ? config.preFetchEle.show() : config.preFetchEle.hide();
                            };
                        };

                        // create new id
                        _id = _.uniqueId();

                        /**
                         * @public
                         * Notifies the data requested for provided identifier.
                         * @param {Function} done callback that get notified with data.
                         * @param [Boolean] hardLoad optional parameter that forces hard load from server
                         */
                        this.getData = function (done, hardLoad) {
                            done = done || function () {
                            };
                            // check if already pre-fetched
                            if (_data && !hardLoad) {
                                // third parametre to tell consumer that I m eligible for pre-fetch element
                                done(true, _data, _preFecthEleToggle);
                                if (typeof window.LegalStickyBottomSheetToggle === 'object' && typeof window.LegalStickyBottomSheetToggle.apply === 'function') {
                                    LegalStickyBottomSheetToggle.apply();
                                }
                                return;
                            }

                            if (_subs.indexOf(done) === -1) _subs.push(done);
                            if (_subs.length > 1) return; // wait for the ajax call to resolve

                            /* Added to avoid I.E. error - https://issues.amazon.com/PrimeDSP-1081 */
                            var _ieCleanUp = function () {
                                var jqData = $(_data);

                                // hit n try to get 3rd or 5th index to avoid huge loop, this should always pass
                                var csmScript1 = $(jqData[3]).html(),
                                    csmScript2 = $(jqData[5]).html(),
                                    scrPointer = "var ue_url='/gp/prime/pipeline/membersignup/uedata",
                                    breakMe = false;
                                // confirm it
                                if (csmScript1 && csmScript1.indexOf(scrPointer) > -1) {
                                    // remove this trouble script
                                    delete jqData[3];
                                } else if (csmScript2 && csmScript2.indexOf(scrPointer) > -1) {
                                    delete jqData[5];
                                } else {
                                    // alas!, loop it
                                    $.each(jqData, function (i, ele) {
                                        if (breakMe) return;
                                        var jqEle = $(ele).html();
                                        if (jqEle && jqEle.indexOf(scrPointer) > -1) {
                                            delete jqData[i];
                                            breakMe = true;
                                        }
                                    });
                                }
                            };
                            $.support.cors = true;
                            // make a Ajax request here for first time
                            $.ajax({
                                type: config.reqType,
                                url: _url,
                                xhrFields: {
                                    withCredentials: true
                                },
                                crossDomain: true,
                                error: function (a, b, c) {
                                    _data = null;
                                    _notify(false);
                                },
                                data: _request,
                                dataType: _contentType,
                                success: function (data) {
                                    try {
                                        _data = data;
                                        // append for pre-fetched element
                                        if (config.preFetchEle) {
                                            // _ieCleanUp();
                                            config.preFetchEle.hide();
                                            config.preFetchEle.html(_data);
                                        }
                                        //done(true, _data = data, _preFecthEleToggle);
                                        _notify(true);
                                    } catch (error) {
                                        var clientId = (_request && _request.clientId) || "";
                                        var ingressId = (_request && _request.ingressId) || "";
                                        var location = clientId.concat("_").concat(ingressId);
                                        P.log("Error in inserting injectable HTML into DOM:" + error +
                                            " location:" + location, "FATAL", "WLPManualInjectableAssets");
                                    }
                                }
                            });
                        };

                        /**
                         * @public
                         * Returns the identifier for current cache instance
                         * @return {String}
                         */
                        this.getId = function () {
                            return _id;
                        };

                        /**
                         * @public
                         * Returns the pre-fetched jQuery element
                         * @return {Object}
                         */
                        this.getPreFetchEle = function () {
                            return config.preFetchEle;
                        };

                        /**
                         * @public
                         * Returns the config for the cache
                         * @return {Object}
                         */
                        this.getConfig = function () {
                            return config;
                        };
                    };

                    var serviceInstance;

                    /**
                     * @class
                     * Creates a new cache instance.
                     * @param {Object} config object that wraps all configurable property for the cache
                     */
                    WlpInjectable.PreFetchService = function () {
                        var Service = function () {
                            var _cache = {};
                            var _self = this;

                            /**
                             * @public
                             * Registers the new pre-fetch service.
                             * @param {Object} config
                             * @return {String}
                             */
                            this.register = function (config) {
                                var instance = new Cache(config);
                                var id = instance.getId();
                                _cache[id] = instance;

                                return id;
                            };

                            /**
                             * Sends a request to WLPV3 to emit a PMET metric, to record an injectable click
                             * for the locationId associated with this PreFetchService.
                             * @param config Cache config containing the request params
                             */
                            this.emitInjectableClickMetric = function (config) {
                                if (!('request' in config)) {
                                    return;
                                }
                                if ('locationID' in config.request) {
                                    var locationId = config.request.locationID;
                                } else {
                                    if ('clientId' in config.request) {
                                        var clientId = config.request.clientId;
                                    } else {
                                        var clientId = "default";
                                    }
                                    if ('ingressId' in config.request) {
                                        var ingressId = config.request.ingressId;
                                    } else {
                                        var ingressId = "default";
                                    }
                                    var locationId = clientId + "_" + ingressId;
                                }
                                var WLPV3ACTIONFLOW_ENDPOINT = "/hp/wlp/pipeline/signups";
                                var postData = {
                                    "actionFlowId": "WLPAction_EmitMetrics",
                                    "metricPrefix": "WLPInjectableClick:",
                                    "metricName": locationId
                                };
                                $.ajax({
                                    type: "POST",
                                    url: WLPV3ACTIONFLOW_ENDPOINT,
                                    data: postData,
                                });
                            }
                            /**
                             * @public
                             * Provides the data for id as registered earlier.
                             * If id is not found, it utilizes the config param to perform hard-fetch
                             * Also records a click metric using WLPV3, as this function is called upon WLP Injectable click.
                             * @param {String} id id that was supplied via register function.,
                             * callee can send it as invalid for hard-fetch.
                             * @param {Function} onComplete callback that gets called immediately if fetch was performed in past,
                             * else it gets invoked asynchronously for hard-fetch.
                             * @param [Object] config optional config object to support hard-fetch
                             * @return {String} identifier for the pre-fetch instance.
                             */
                            this.get = function (id, onComplete, config) {
                                if (!_.isFunction(onComplete)) {
                                    return;
                                }

                                // get it from cache if available
                                if (_cache[id]) {
                                    this.emitInjectableClickMetric(_cache[id].getConfig());
                                    _cache[id].getData(onComplete);
                                    return id;
                                }

                                // fetch only for valid config
                                if (!_.isObject(config)) {
                                    return;
                                }

                                var newId = _self.register(config);
                                // get data now
                                _cache[newId].getData(onComplete);
                                return newId;
                            };

                            /**
                             * @public
                             * Invalidates the pre-populated cache instance.
                             * @param {String} id identifier for cache
                             * @param [Boolean] refresh optional refresh cache param
                             * @return {String} id that was invalidated/refreshed
                             */
                            this.invalidate = function (id, refresh) {
                                var config;
                                if (_cache[id]) {
                                    config = _cache[id].getConfig();
                                }

                                delete _cache[id]; // invalidate
                                if (refresh && config) {
                                    // refresh the cache as requested
                                    id = _self.register(config);
                                }

                                return id;
                            };
                        };

                        // instantiate it for very first request
                        return serviceInstance = serviceInstance || new Service();
                    };

                })(window.WlpInjectable = window.WlpInjectable || {}, WlpInjectable._, A.$);

                return WlpInjectable;

            });
        })


        /** Initialization module to kick off the setup **/
        var config;
        var weblabResp = "T1";
        P.when('A', 'wlp-injectable-widget').execute(
            function (A, u) {
                (function (WlpInjectable, $, _) {
                    /**
                     * @private
                     * @class Widget
                     * Creates a Injectable Widget instance.
                     * @param {Object} provider widget provider
                     * @param {Object} jQEle jQuery element for hooking the injectable widget
                     */
                    var Widget = function (provider, jQEle) {
                        /**
                         * @public
                         * registers the widget provider with the external element provided,
                         * during Widget construction.
                         * @param {Object} config object
                         */
                        this.register = function () {
                            var enableFullpageRedirect = false;
                            // populate the data attributes

                            // If user agent is of mobile, we are removing param inline=1. For inline =1 there is a separate use case
                            // for authenticating user and that cause a redirection back to injectable page with load-pup-up=1.
                            // We don't want that in case of full page redirect.
                            if (enableFullpageRedirect && (/Android/.test(navigator.userAgent))
                                && !(/Mobile/.test(navigator.userAgent))) {

                                var currentPageURL = window.location.href;
                                var currentPageRelativeURL = currentPageURL.replace(/^(?:\/\/|[^\/]+)*\//, "/");

                                var redirectURL = currentPageRelativeURL;
                                if (jQEle.attr('data-success-redirect-url') && jQEle.attr('data-success-redirect-url').trim().length > 0) {
                                    redirectURL = jQEle.attr('data-success-redirect-url');
                                }

                                var cancelRedirectURL = currentPageRelativeURL;
                                if (jQEle.attr('data-cancel-redirect-url') && jQEle.attr('data-cancel-redirect-url').trim().length > 0) {
                                    cancelRedirectURL = jQEle.attr('data-cancel-redirect-url');
                                }

                                config = {
                                    clientId: jQEle.attr('data-client-id'),
                                    ingressId: jQEle.attr('data-ingress-id'),
                                    ref: jQEle.attr('data-ref'),
                                    primeCampaignId: jQEle.attr('data-campaign-id'),
                                    redirectURL: btoa(redirectURL),
                                    shouldRedirect: jQEle.attr('should-redirect'),
                                    cancelRedirectURL: btoa(cancelRedirectURL),
                                    benefitOptimizationId: jQEle.attr('data-benefit-optimization-id') || "default",
                                    planOptimizationId: jQEle.attr('data-plan-optimization-id') || "default",
                                    disablePrefetch: !!true,
                                    wait: 1
                                };
                            } else {
                                config = {
                                    clientId: jQEle.attr('data-client-id'),
                                    ingressId: jQEle.attr('data-ingress-id'),
                                    ref: jQEle.attr('data-ref'),
                                    primeCampaignId: jQEle.attr('data-campaign-id'),
                                    redirectURL: btoa(jQEle.attr('data-success-redirect-url') || window.location.href),
                                    shouldRedirect: jQEle.attr('should-redirect'),
                                    cancelRedirectURL: jQEle.attr('data-cancel-redirect-url'),
                                    benefitOptimizationId: jQEle.attr('data-benefit-optimization-id'),
                                    planOptimizationId: jQEle.attr('data-plan-optimization-id'),
                                    disablePrefetch: !!true,
                                    inline: '1'
                                };
                            }
                            ;
                            const addToConfigIfPresent = (dataKeyName, configKeyName) => {
                                if (jQEle.attr(dataKeyName) && jQEle.attr(dataKeyName).trim().length > 0) {
                                    config = {
                                        ...config,
                                        [configKeyName]: jQEle.attr(dataKeyName)
                                    }
                                }
                            }
                            addToConfigIfPresent('data-offer-token', 'offerToken');
                            addToConfigIfPresent('data-previous-container-request-id', 'previousContainerRequestID');
                            addToConfigIfPresent('data-location-id', 'locationID');
                            addToConfigIfPresent('data-pd-rd-r', 'pd_rd_r');
                            addToConfigIfPresent('data-pd-rd-w', 'pd_rd_w');
                            addToConfigIfPresent('data-pd-rd-wg', 'pd_rd_wg');
                            addToConfigIfPresent('data-pf-rd-r', 'pf_rd_r');
                            addToConfigIfPresent('data-pf-rd-p', 'pf_rd_p');
                            addToConfigIfPresent('data-purchase-id', 'purchaseId');
                            addToConfigIfPresent('data-shipping-charge', 'shippingCharge');
                            addToConfigIfPresent('data-incentive-id', 'incentiveId');
                            addToConfigIfPresent('data-event-classification-name', 'eventClassificationName');

                            u.setCSMInjectionParam(config);

                            // we want to be pre-fetched, smart!
                            provider.registerPreFetch(config);
                            var ping = function () {
                                provider.initWidget(null, function (success, loadPopUp) {
                                    if (!success) return;
                                    loadPopUp();
                                });
                            };
                            var signInRedirect = (window.location.href).indexOf('load-pop-up') !== -1;
                            signInRedirect && ping();

                            // call to register the click event of the button
                            //jQEle.click(ping);
                            $(document).delegate(ingressClass, 'click', function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                ping();
                            });
                        };

                    };
                    var ingressClass = '.prime-signup-ingress';
                    _.defer(function () {
                        // get the agreed upon css-class for the ingress button/link
                        var ele = $(ingressClass);
                        var provider = WlpInjectable.DependencyInjector.get('widget-provider');
                        if (ele.length === 0) {
                            // no ingress class found, cann't do anything
                            return;
                        }
                        // instantiate widget at execution time
                        (new Widget(provider(), ele)).register();
                        /*$.each(ele, function(i, jqE) {
                            (new Widget(provider(ele.length > 1), $(jqE))).register();
                        });*/

                        // trigger widget complete
                        A.trigger('wlp-widget-ready', ele);
                    });

                })(window.WlpInjectable = window.WlpInjectable || {}, A.$, window.WlpInjectable._);
            }
        );
        module.isRegistered = true;
    })(window.WlpInjectable = window.WlpInjectable || {});
} catch (e) {
    console.log(e)
}
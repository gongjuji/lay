;
(function(win, $, undefined){

    "use strict";

    var version = '1.0',
        defaults = {
            title: '提示信息',
            /**
             *  true, false or 'close'
             */
            shade: true,
            control: true,
            /**
             *  in use
             *  change to control
             *  to be deleted
             */
            layControl: true,
            enterEvent: false,
            escEvent: true,
            /*

            */

            /**
             *  middle
             *  top
             *  bottom
             */
            position: 'middle',
            space: 15,
            minWidth: null,
            maxWidth: null,
            /**
             *  false, 'alert', 'confirm'
             */
            btns: false,
            okText: '确定',
            cancelText: '取消',
            params: null,
            classNames: null,
            styles: ''

        },
        l,
        zIndex = 888,
        layCounter = 0,
        type,
        index,
        layWidth,
        layHeight,
        objStyle,
        cls = {
            'lay-shade': 'lay-shade',
            'lay-body': 'lay-body',
            'lay-title': 'lay-title',
            'lay-control': 'lay-control',
            'lay-close': 'lay-close',
            'lay-content': 'lay-content',
            'lay-btns': 'lay-btns',
            'lay-btn-confirm': 'lay-btn-confirm',
            'lay-btn-cancel': 'lay-btn-cancel'
        };

    var Lay = function(){

    }


    /**
     * var getTypeOfArgs - get the type of funcion arguments
     * @param  {json} args the arguments of method
     * @return {json} classify the arguments
    **/

    var getTypeOfArgs = function(args){

        var strArgs = [],
            jsonArgs = [],
            fnArgs = [];

        for(var i=0; i<args.length; i++){
            var arg = args[i];
            switch(typeof arg){
                case 'string':
                strArgs.push(arg);
                break;

                case 'object':
                jsonArgs.push(arg);
                break;

                case 'function':
                fnArgs.push(arg);
                break;
            }
        }

        return {
            strArgs: strArgs,
            jsonArgs: jsonArgs,
            fnArgs: fnArgs
        }

    }


    /**
     *  create options
     */

    var createOptions = function(typeOfArgs){

        var typeOfArgs,
            strArgs,
            jsonArgs,
            fnArgs,
            content,
            options,
            ok,
            cancel;

        strArgs = typeOfArgs['strArgs'];
        jsonArgs = typeOfArgs['jsonArgs'];
        fnArgs = typeOfArgs['fnArgs'];
        strArgs.length? content = strArgs[0] : content = '';
        jsonArgs.length? options = jsonArgs[0] : options = {};
        ok = fnArgs[0];
        cancel = fnArgs[1];

        return {
            content: content,
            options: options,
            ok: ok,
            cancel: cancel
        }
    }


    /**
     *  prototype
     */

    Lay.prototype = {

        version: version,

        defaults: defaults,


        /**
         *  params:
         *  content     string
         *  options     json
         *  ok          callback
         *  cancel      callback
         */

        alert: function(content, options, ok, cancel){

            var args = arguments;
            var privateDefaults = {
                type: 1,
                btns: 'alert',
                enterEvent: true,
                minWidth: '240px',
                maxWidth: '450px',
                privateCls: {
                    'lay-body': 'lay-alert'
                }
            };



            this.init(args, privateDefaults);
            return layCounter;
        },


        confirm: function(content, options, ok, cancel){
            var args = arguments;
            var privateDefaults = {
                type: 2,
                btns: 'confirm',
                enterEvent: true,
                minWidth: '240px',
                maxWidth: '450px',
                privateCls: {
                    'lay-body': 'lay-confirm'
                }
            };

            this.init(args, privateDefaults);
            return layCounter;
        },


        msg: function(){
            var args = arguments;
            var privateDefaults = {
                type: 3,
                title: false,
                control: false,
                btns: false,
                privateCls: {
                    'lay-shade': 'shade-transparent',
                    'lay-body': 'lay-msg'
                }
            };

            this.init(args, privateDefaults);
            return layCounter;
        },


        tip: function(){
            var args = arguments;
            var privateDefaults = {
                type: 4,
                title: false,
                control: false,
                btns: false,
                privateCls: {
                    'lay-shade': 'shade-transparent',
                    'lay-body': 'lay-tip'
                }
            };

            this.init(args, privateDefaults);
            return layCounter;
        },


        pop: function(){
            var args = arguments;
            var privateDefaults = {
                type: 5,
                privateCls: {
                    'lay-body': 'lay-pop'
                }
            };

            this.init(args, privateDefaults);
            return layCounter;
        },


        close: function(index){
            var index = index || layCounter;
            $("[laycounter=" + index + "]").remove();
        },


        /**
         *  init
         */

        init: function(args, privateDefaults){
            var typeOfArgs = getTypeOfArgs(args);
            var opts = createOptions(typeOfArgs);
            this.createLay(opts, privateDefaults);
            this.setPosition();
            this.setStyles();
            this.eventBind();
        },


        /**
         *  create lay doms
         */

        createLayDoms: function(title, content, okText, cancelText, layCounter){
            var cls = this.cls;
            var styles = this.styles;
            return {
                // lay-shade
                a: '<div class="' + cls['lay-shade'] + '" layCounter="' + layCounter + '"></div>',
                // lay-body
                b: '<div class="' + cls['lay-body'] + '" layCounter="' + layCounter + '">',
                // lay-title
                c: '<div class="' + cls['lay-title'] + '">' + title + '</div>',
                // lay-control
                d: '<div class="' + cls['lay-control'] + '"><i class="' + cls['lay-close'] + '">&times;</i></div>',
                // lay-content
                e: '<div class="' + cls['lay-content'] + '" style="' + styles + '" >' + content + '</div>',
                // lay-btns
                f: '<div class="' + cls['lay-btns'] + '">',
                // lay-btn-confirm
                g: '<a class="' + cls['lay-btn-confirm'] + '">' + okText + '</a>',
                // lay-btn-cancel
                h: '<a class="' + cls['lay-btn-cancel'] + '">' + cancelText + '</a>',
                fe: '</div>',
                be: '</div>'
            };
        },



        /**
         *  create lay
         */

        createLay: function(options, privateDefaults){
            var _this = this;
            var l = $(".lay-body[laycounter=" + ++layCounter + "]"),
                content = options.content,
                opts = $.extend({}, _this.defaults, privateDefaults, options.options),
                type = opts.type,
                shade = opts.shade,
                title = opts.title,
                btns = opts.btns,
                okText = opts.okText,
                cancelText = opts.cancelText,
                classNames = opts.classNames,
                privateCls = opts.privateCls,
                layDoms,
                doms = '';

            console.log(opts);

            this.styles = opts.styles,
            this.position = opts.position;
            this.space = opts.space;
            this.ok = opts.ok || options.ok;
            this.cancel = opts.cancel || options.cancel;
            this.params = opts.params || options.params;
            this.shade = opts.shade;
            this.layControl = opts.layControl;
            this.control = opts.control;
            this.enterEvent = opts.enterEvent;
            this.escEvent = opts.escEvent;

            this.minWidth = opts.minWidth;
            this.maxWidth = opts.maxWidth;

            for(var i in privateCls){
                privateCls[i] = cls[i] + ' ' + privateCls[i];
            }

            this.cls = $.extend({}, cls, privateCls);

            if(classNames){
                this.cls['lay-body'] += ' ' + classNames;
            }

            layDoms = this.createLayDoms(title, content, okText, cancelText, layCounter);


            /**
             *  dispaly control:
             *  shade
             *  title
             *  layControl
             *  btns
             */

            /* shade */
            if(this.shade){
                doms += layDoms['a'];
            }

            /* lay body */
            doms += layDoms.b;

            /* title */
            if (title) {
                doms += layDoms.c;
            }

            /* control btns */
            if (this.layControl && this.control) {
                doms += layDoms.d;
            }

            /* content */
            doms += layDoms.e;

            /* btns */
            if(btns){

                doms += layDoms.f;

                /* confirm btn */
                doms += layDoms.g;

                /* cancel btn */
                if (btns=== 'confirm') {
                    doms += layDoms.h;
                }

                /* btns end */
                doms += layDoms.fe;
            }

            /* body end */
            doms += layDoms.be;

            $('body').append(doms);
        },


        /**
         *  set position
         */

        setPosition: function(index){
            var _this = this;
            var index = index || layCounter;
            $(".lay-body[laycounter=" + index + "]").each(function(){
                var position = _this.position;

                switch(position){

                    /* middle */
                    case 'middle':
                    $(this).css({
                        'margin-top': -$(this).outerHeight()/2
                    });
                    break;

                    /* top */
                    case 'top':
                    $(this).css({
                        'top': _this.space
                    });
                    break;

                    /* bottom */
                    case 'bottom':
                    $(this).css({
                        'top': 'auto',
                        'bottom': _this.space
                    });
                    break;

                    /* top left */
                    case 'topLeft':
                    $(this).css({
                        'top': _this.space,
                        'left': _this.space
                    });
                    break;

                    /* top right */
                    case 'topRight':
                    $(this).css({
                        'top': _this.space,
                        'left': 'auto',
                        'right': _this.space
                    });
                    break;

                    /* top right */
                    case 'topRight':
                    $(this).css({
                        'top': _this.space,
                        'left': 'auto',
                        'right': _this.space
                    });
                    break;

                    /* bottom right */
                    case 'bottomRight':
                    $(this).css({
                        'left': 'auto',
                        'top': 'auto',
                        'bottom': _this.space,
                        'right': _this.space
                    });
                    break;

                    /* bottom left */
                    case 'bottomLeft':
                    $(this).css({
                        'left': _this.space,
                        'top': 'auto',
                        'bottom': _this.space
                    });
                    break;

                    default:
                    break;
                }

                if(_this.position==='middle' || _this.position==='top' || _this.position==='bottom'){
                    $(this).css({
                        'margin-left': -$(this).outerWidth()/2
                    });
                }

            });
        },


        setStyles: function(){

        },


        /**
         *  onConfirm
         *  bind confirm
         */

        onConfirm: function(){
            this.close();
            this.ok? this.ok(this.params): '';
        },


        /**
         *  onCancle
         *  bind cancel
         */

        onCancel: function(){
            this.close();
            this.cancel? this.cancel(): '';
        },


        /**
         *  event bind
         */

        eventBind: function(){

            var _this = this;

            $('.lay-close').click(function(){
                _this.onCancel();
            });

            if(_this.shade==='close'){
                $('.lay-shade').click(function(){
                    _this.onCancel();
                });
            }

            $('.lay-btn-cancel').click(function(){
                _this.onCancel();
            });

            $('.lay-btn-confirm').click(function(){
                _this.onConfirm();
            });

            if(!(this.layControl && this.control)){
                _this.escEvent = false;
                _this.enterEvent = false;
            }

            $(window).keyup(function(e) {
                switch (e.keyCode) {
                    case 27:
                        if(_this.escEvent){
                            _this.onCancel();
                        }
                        break;
                    case 13:
                        if(_this.enterEvent){
                            _this.onConfirm();
                        }
                        break;
                    default:
                        break;
                }
            });
        },

        /*

        /**
         * setDefaults
         *
         * @param  {json} options
         */

        setDefaults: function(options){
            var _this = this;
            this.defaults = $.extend({}, _this.defaults, options);
        }

    }

    window.lay = new Lay();

})(window, jQuery);

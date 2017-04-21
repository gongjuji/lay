;
(function(win, $, undefined){

    "use strict";

    var version = '1.0',
        defaults = {
            title: '提示信息',
            /*
                true, false or 'close'
            */
            shade: true,
            control: true,
            /*
                in use
                change to control
                to be deleted
            */
            layControl: true,
            enterEvent: false,
            escEvent: true,
            /*
                middle
                top
                bottom
            */
            position: 'middle',
            space: 15,
            /*
                false, 'alert', 'confirm'
            */
            btns: false,
            okText: '确定',
            cancelText: '取消',
            params: null,
            classNames: null,
            styles: null

        },
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


    /*
        get the type of funcion arguments
        return back a json object
        {
            strArgs: strArgs,
            jsonArgs: jsonArgs,
            fnArgs: fnArgs,
            opts: {
                content: content,
                options: options,
                ok: ok,
                cancel: cancel
            }
        }
    */

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


    /*
        create options
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


    /*
        prototype
    */

    Lay.prototype = {

        version: version,

        /*
            params:
            content         string
            options         json
            ok              callback
            cancel          callback
        */

        alert: function(content, options, ok, cancel){
            var args = arguments;
            var privateDefaults = {
                type: 1,
                btns: 'alert',
                enterEvent: true,
                privateCls: {
                    'lay-body': 'lay-body alert'
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
                privateCls: {
                    'lay-body': 'lay-body lay-confirm'
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
                    'lay-shade': 'lay-shade shade-transparent',
                    'lay-body': 'lay-body lay-msg'
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
                    'lay-shade': 'lay-shade shade-transparent',
                    'lay-body': 'lay-body lay-tip'
                }
            };
            // cls['lay-shade']+= ' shade-transparent';
            // cls['lay-body'] += ' lay-tip';
            this.init(args, privateDefaults);
            return layCounter;
        },


        popup: function(){

        },


        close: function(index){
            var index = index || layCounter;
            $("[laycounter=" + index + "]").remove();
        },


        /*
            init
        */

        init: function(args, privateDefaults){
            var typeOfArgs = getTypeOfArgs(args);
            var opts = createOptions(typeOfArgs);
            this.createLay(opts, privateDefaults);
            this.setPosition();
            this.eventBind();
        },


        /*
            create lay doms
        */

        createLayDoms: function(title, content, okText, cancelText, layCounter){
            var cls = this.cls;
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
                e: '<div class="' + cls['lay-content'] + '" >' + content + '</div>',
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


        /*
            create lay
        */

        createLay: function(options, privateDefaults){

            var content = options.content,
                opts = $.extend({}, defaults, privateDefaults, options.options),
                type = opts.type,
                shade = opts.shade,
                title = opts.title,
                btns = opts.btns,
                okText = opts.okText,
                cancelText = opts.cancelText,
                classNames = opts.classNames,
                styles = opts.styles,
                privateCls = opts.privateCls,
                layDoms,
                doms = '';

            console.log(opts);

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

            this.cls = $.extend({}, cls, privateCls);

            layDoms = this.createLayDoms(title, content, okText, cancelText, ++layCounter);

            if(classNames){
                this.cls['lay-body'] += ' ' + classNames;
            }

            if(styles){

            }

            /*
                dispaly control:

                shade
                title
                layControl
                btns

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


        /*
            set position
        */

        setPosition: function(index){
            var that = this;
            var index = index || layCounter;
            $(".lay-body[laycounter=" + index + "]").each(function(){
                var position = that.position;

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
                        'top': that.space
                    });
                    break;

                    /* bottom */
                    case 'bottom':
                    $(this).css({
                        'top': 'auto',
                        'bottom': that.space
                    });
                    break;

                    /* top left */
                    case 'topLeft':
                    $(this).css({
                        'top': that.space,
                        'left': that.space
                    });
                    break;

                    /* top right */
                    case 'topRight':
                    $(this).css({
                        'top': that.space,
                        'left': 'auto',
                        'right': that.space
                    });
                    break;

                    /* top right */
                    case 'topRight':
                    $(this).css({
                        'top': that.space,
                        'left': 'auto',
                        'right': that.space
                    });
                    break;

                    /* bottom right */
                    case 'bottomRight':
                    $(this).css({
                        'left': 'auto',
                        'top': 'auto',
                        'bottom': that.space,
                        'right': that.space
                    });
                    break;

                    /* bottom left */
                    case 'bottomLeft':
                    $(this).css({
                        'left': that.space,
                        'top': 'auto',
                        'bottom': that.space
                    });
                    break;

                    default:
                    break;
                }

                if(that.position==='middle' || that.position==='top' || that.position==='bottom'){
                    $(this).css({
                        'margin-left': -$(this).outerWidth()/2
                    });
                }

            });
        },


        /*
            onConfirm
            bind confirm
        */

        onConfirm: function(){
            this.close();
            this.ok? this.ok(this.params): '';
        },


        /*
            onCancle
            bind cancel
        */

        onCancel: function(){
            this.close();
            this.cancel? this.cancel(): '';
        },


        /*
            event bind
        */

        eventBind: function(){

            var that = this;

            $('.lay-close').click(function(){
                that.onCancel();
            });

            if(that.shade==='close'){
                $('.lay-shade').click(function(){
                    that.onCancel();
                });
            }

            $('.lay-btn-cancel').click(function(){
                that.onCancel();
            });

            $('.lay-btn-confirm').click(function(){
                that.onConfirm();
            });

            if(!(this.layControl && this.control)){
                that.escEvent = false;
                that.enterEvent = false;
            }

            $(window).keyup(function(e) {
                switch (e.keyCode) {
                    case 27:
                        if(that.escEvent){
                            that.onCancel();
                        }
                        break;
                    case 13:
                        if(that.enterEvent){
                            that.onConfirm();
                        }
                        break;
                    default:
                        break;
                }
            });
        }

    }

    var lay = window.lay = new Lay();
    $.alert = lay.alert;
    $.confirm = lay.confirm;
    $.tip = lay.tip;
    $.popup = lay.popup;

})(window, jQuery);

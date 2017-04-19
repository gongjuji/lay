;
(function(win, $, undefined){

    "use strict";

    var version = '1.0',
        defaults = {
            title: '提示信息',
            okText: '确定',
            cancelText: '取消',
            /*
                true, false or 'close'
            */
            shade: true,
            layControl: true,
            params: null
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
            'lay-body': 'lay-body lay-msg',
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
            this.init(args, 1);
            return layCounter;
        },


        confirm: function(content, options, ok, cancel){
            var args = arguments;
            this.init(args, 2);
            return layCounter;
        },


        tip: function(){

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

        init: function(args, type){
            var typeOfArgs = getTypeOfArgs(args);
            var opts = createOptions(typeOfArgs);
            this.createLay(opts, type);
            this.setPosition();
            this.eventBind();
        },


        /*
            create lay doms
        */

        createLayDoms: function(title, content, okText, cancelText, layCounter){
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

        createLay: function(options, type){
            // console.log(options);
            // console.log(type);
            var content = options.content,
                opts = options.options,
                shade = opts.shade || defaults['shade'],
                title = opts.title || defaults['title'],
                okText = opts.okText || defaults['okText'],
                cancelText = opts.cancelText || defaults['cancelText'],
                layDoms = this.createLayDoms(title, content, okText, cancelText, ++layCounter),
                doms = '';

            this.ok = opts.ok || options.ok;
            this.cancel = opts.cancel || options.cancel;
            this.params = opts.params || options.params;

            shade===false? this.shade=false: shade===true? this.shade=true: this.shade='close'

            this.layControl = opts.layControl || defaults['layControl'];


            /* shade */

            if(this.shade){
                doms += layDoms['a'];
            }

            doms += layDoms.b;

            if (title) {
                doms += layDoms.c;
            }

            if (this.layControl) {
                doms += layDoms.d;
            }

            doms += layDoms.e;

            doms += layDoms.f;
            doms += layDoms.g;
            if (type == 2) {
                doms += layDoms.h;
            }
            doms += layDoms.fe;

            doms += layDoms.be;

            $('body').append(doms);
        },


        /*
            set position
        */
        setPosition: function(index){
            var index = index || layCounter;
            $(".lay-body[laycounter=" + index + "]").each(function(){
                $(this).css({
                    'margin-left': -$(this).outerWidth()/2,
                    'margin-top': -$(this).outerHeight()/2
                });
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

            $(window).keyup(function(e) {
                switch (e.keyCode) {
                    case 27:
                        that.onCancel();
                        break;
                    case 13:
                        that.onConfirm();
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

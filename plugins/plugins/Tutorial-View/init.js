/*
 *  Place copyright or other info here...
 */

(function(global, $){
    
    // Define core
    var codiad = global.codiad,
        scripts= document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';

    // Instantiates plugin
    $(function() {    
        codiad.Tutorial.init();
    });

    codiad.Tutorial = {
        
        // Allows relative `this.path` linkage
        path: curpath,

        init: function() {

            var _this = this;
            $.get(_this.path+"template.html", function(data){
                var panelh = $('#editor-region').height() / 3;

                $('#editor-top-bar')
                .css({
                    top: panelh + 'px',
                })
                .before(data);

                $('.favorites-sb')
                .css({
                    height: panelh + 'px',
                    left: 0,
                    right: '10px',
                    top: 0,
                    bottom: 'auto'
                });

                $('#root-editor-wrapper')
                .css({
                    top: (panelh + 35) + 'px',
                });
            });

            if ($('.editor-region').size() > 1) {
                codiad.message.error("Livepreview does not work with split windows");
                return false;
            }

            amplify.subscribe('active.onOpen', function(path){
                 _this.open(path+".html");
            });

            amplify.subscribe('active.onFocus', function(path){
                _this.open(path+".html");
            });
            amplify.subscribe('filemanager.onIndex', function(path,index){
                //console.log("dir "+path.path);
                foldername=path.path.split("/");
                _this.open(path.path+"/"+foldername[foldername.length-1]+".html");
              
            });
            
        },

        /**
         * 
         * This is where the core functionality goes, any call, references,
         * script-loads, etc...
         * 
         */
         
         open: function(path) {
             var _this = this;
             var tutorial_path="workspace/"+path;
            // console.log(tutorial_path);
             $.get(tutorial_path + "?rnd=" + new Date().getTime())
                .done(function() { 
                    $('#frame_tutorial').attr("src",tutorial_path);
                }).fail(function() { 
                    $('#frame_tutorial').attr("src",_this.path+"error_tutorial.html");
                })
             
         }

    };

})(this, jQuery);

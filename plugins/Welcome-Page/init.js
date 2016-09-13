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
        codiad.Welcome_page.init();
    });

    codiad.Welcome_page = {
        
        // Allows relative `this.path` linkage
        path: curpath,

        init: function() {

            
            
        },

        /**
         * 
         * This is where the core functionality goes, any call, references,
         * script-loads, etc...
         * 
         */
         
         SOME_METHOD: function() {
            alert('Hello World');  
         }

    };

})(this, jQuery);

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
        $.loadScript('plugins/Tutorial-View/js/tags.js');
    });

    codiad.Tutorial = {

        // Allows relative `this.path` linkage
        path: curpath,

        init: function() {

          $( window ).bind("resize", function(){
            var leftw=$(window).width()-$("#sb-left").width();
            $("#tutorialtemplate").css("width", leftw+"px");
            $("#tutorialcontent").css("width", leftw+"px");

          });

          $('#tutorialtemplate')
          .css({
              width: ($(window).width()-$('#sb-left').width())+'px' ,
              height: ($(window).height()/2 - 20 )+ 'px',
              left: $('#sb-left').width(),
              right: '10px',
              top: 0,
              bottom: '0px'
          });
          $('#tutorialcontent')
          .css({
              width: ($(window).width()-$('#sb-left').width())+'px' ,
              height: ($(window).height()/2 - 20 )+ 'px',
              left: $('#sb-left').width(),
              right: '10px',
              top: 0,
              bottom: '0px'
          });
          $('#editor-region')
          .css({
              height: $('#tutorialtemplate').height() + 'px',
              top: $('#tutorialtemplate').height()  + 'px',
              bottom:  '0px'
          });
          $('#editor-top-bar')
          .css({
              top: $('#tutorialtemplate').height() + 'px',

          });
          var _this = this;

            if ($('.editor-region').size() > 1) {
                codiad.message.error("Livepreview does not work with split windows");
                return false;
            }

           amplify.subscribe('project.onOpen', function(tutorial){
                _this.open(tutorial);
                setTimeout(function(){
              	    codiad.Console.loadTOC();
              	}, 300);

            });
            _this.open("tutorialwelcome");
            setTimeout(function(){
                codiad.Console.loadTOC();
            }, 300);

            $('#controls').click(function(){
              codiad.Tutorial.showControls();
            });


          }
        ,
        showControls: function(data_file) {
            var _this = this;
            codiad.modal.load(200, 'plugins/Tutorial-View/controls.php');
            codiad.modal.hideOverlay();

        },
         open: function(tutorial) {
             var _this = this;
             var tutorial_path=_this.path+"/tutorial/"+tutorial+".html";
            // console.log(tutorial_path);
             $.get(tutorial_path + "?rnd=" + new Date().getTime())
                .done(function() {
                    $('#tutorialcontent').load(tutorial_path);
                    $('#tutorialname').html("Tutorial: "+tutorial);
                    var leftw=$(window).width()-$("#sb-left").width();
                    $("#tutorialtemplate").css("width", leftw+"px");
                })

         }

    };

})(this, jQuery);

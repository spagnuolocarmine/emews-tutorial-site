/*
 *  Place copyright or other info here...
 */

(function(global, $){

    // Define core
    var codiad = global.codiad,
        scripts= document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';
    var markers = new Map();
    var editor_open=true;

    // Instantiates plugin
    $(function() {
        codiad.tutorial.init();
        $.loadScript('plugins/Tutorial-View/js/tags.js');
    });

    codiad.tutorial = {

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


          $('#tab-dropdown').css("top",($("#editor-top-bar").offset().top)+'px');

          $(".collapse-dropdown").css("top",$("#editor-top-bar").offset().top+'px');

          var _this = this;

            if ($('.editor-region').size() > 1) {
                codiad.message.error("Livepreview does not work with split windows");
                return false;
            }

           amplify.subscribe('project.onOpen', function(tutorial){
                _this.open(tutorial);
                setTimeout(function(){
              	    codiad.console.loadTOC();
              	}, 300);

            });
            /*_this.open("tutorialwelcome");
            setTimeout(function(){
                codiad.Console.loadTOC();
            }, 300);*/

            $('#controls').click(function(){
              codiad.tutorial.showControls();
            });

            $('#downeditor').click(function(){

              if(editor_open)
              {
                editor_open = false;
                $('#editor-top-bar').css("top",$(window).height()- 34);
                $('#tutorialcontent').css("height",$(window).height()- 34);
                $('.collapse-dropdown').css("top",$(window).height()- 34);
                $('#tab-dropdown').css("top",$(window).height()- 34);
                $('#editor-region').css("top",$(window).height()- 25);
                $('#root-editor-wrapper').hide();
                $('#cursor-position').hide();
                $('#downeditor').removeClass("icon-down-dir");
                  $('#downeditor').addClass("icon-up-dir");
              }else{
                $('#editor-top-bar').css("top",$(window).height()/2 - 34);
                $('#tutorialcontent').css("height",$(window).height()/2 - 34);
                $('.collapse-dropdown').css("top",$(window).height()/2 - 34 );
                $('#tab-dropdown').css("top",$(window).height()/2 - 34);
                $('#editor-region').css("top",$(window).height()/2 - 25);
                $('#root-editor-wrapper').show();
                $('#cursor-position').show();
                $('#downeditor').addClass("icon-down-dir");
                  $('#downeditor').removeClass("icon-up-dir");
                editor_open = true;
              }

            });



          }
        ,
        openEditor:  function()
        {
          if(!editor_open)
          {
            console.log("gesocrist");
            $('#editor-top-bar').css("top",$(window).height()/2 - 34);
            $('#tutorialcontent').css("height",$(window).height()/2 - 34);
            $('.collapse-dropdown').css("top",$(window).height()/2 - 34 );
            $('#tab-dropdown').css("top",$(window).height()/2 - 34);
            $('#editor-region').css("top",$(window).height()/2 - 25);
            $('#root-editor-wrapper').show();
            $('#cursor-position').show();
            $('#downeditor').addClass("icon-down-dir");
            $('#downeditor').removeClass("icon-up-dir");
            editor_open = true;
          }
        },
        closeEditor:  function()
        {
          if(editor_open)
          {
            editor_open = false;
            $('#editor-top-bar').css("top",$(window).height()- 34);
            $('#tutorialcontent').css("height",$(window).height()- 34);
            $('.collapse-dropdown').css("top",$(window).height()- 34);
            $('#tab-dropdown').css("top",$(window).height() - 34);
            $('#editor-region').css("top",$(window).height()- 25);
            $('#root-editor-wrapper').hide();
            $('#cursor-position').hide();
            $('#downeditor').removeClass("icon-down-dir");
            $('#downeditor').addClass("icon-up-dir");
          }
        },
        highlightCode: function(code,fromline,toline,colorvalue)
        {
          if(colorvalue)
          var classcolorname=colorvalue.replace("(","").replace(")","").replace(",","").replace(",","").replace(",","").replace(".","_");

          var stylecolor="."+classcolorname+"{position: absolute;background:"+colorvalue+";z-index: 20;}";
          $("<div/>", {html: '&shy;<style>' + stylecolor + '</style>'}).appendTo("body");
          var checkExist=setInterval(function() {
                if ($('#file-manager ul').length) {
                  codiad.filemanager.openFile(code,true);
                    var checkExist2=setInterval(function() {
                        var container = $('#file-manager');

                          codiad.filemanager.index(code.substring(0,code.lastIndexOf("/")),true);
                          setTimeout(function(){
                            codiad.active.gotoLine(fromline);
                            var newmarker=codiad.editor.highlightCode(code,classcolorname,fromline,toline);;
                            if(codiad.tutorial.getHighlightMarker(code) != undefined && newmarker!=codiad.tutorial.getHighlightMarker(code))
                              codiad.editor.clearHighlightCode(code,codiad.tutorial.getHighlightMarker(code));
                            codiad.tutorial.setHighlightMarker(code,newmarker);
                          },300);

                     clearInterval(checkExist2);
                  }, 20);
                clearInterval(checkExist);
              }
            }, 20);

            amplify.publish('tutorial.onHighlight',[code,fromline,toline,colorvalue]);
        },
        openCode: function(code)
        {

          var checkExist=setInterval(function() {
                if ($('#file-manager').length) {
                  codiad.filemanager.openFile(code,true);
                  codiad.filemanager.index(code.substring(0,code.lastIndexOf("/")),true);

                clearInterval(checkExist);
              }
            }, 20);

        },
        getHighlightMarker: function(code) {
            return markers[code];

        },
        setHighlightMarker: function(code,markerid) {
            return markers[code]=markerid;

        },
        showControls: function(data_file) {
            var _this = this;
            codiad.modal.load(200, 'plugins/Tutorial-View/controls.php');
            codiad.modal.hideOverlay();

        },
         open: function(tutorial) {
           console.log(tutorial);
             var _this = this;
             var tutorial_path=_this.path+"/tutorial/"+tutorial+".html";
            // console.log(tutorial_path);
             $.get(tutorial_path + "?rnd=" + new Date().getTime())
                .done(function() {
                    $('#tutorialcontent').load(tutorial_path);
                    $('#tutorialname').html("Tutorial: "+tutorial);
                    var leftw=$(window).width()-$("#sb-left").width();
                    $("#tutorialtemplate").css("width", leftw+"px");
                    var checkExist=setInterval(function() {
                      if ($('#toc').length) {
                          setTimeout(function () {codiad.console.loadTOC();},400);

                          clearInterval(checkExist);
                        }
                      }, 20);

                })

         }
    };

})(this, jQuery);

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
    var _perc_tutorial_size = undefined;

    // Instantiates plugin
    $(function() {
        codiad.tutorial.init();
        $.loadScript('plugins/Tutorial-View/custom-tags/bower_components/webcomponentsjs/webcomponents-lite.min.js');
        $('head').append('<link rel="import" href="plugins/Tutorial-View/custom-tags/highlight-code.html">');
        $('head').append('<link rel="import" href="plugins/Tutorial-View/custom-tags/open-code.html">');
        $('head').append('<link rel="import" href="plugins/Tutorial-View/custom-tags/modal-data.html">');
        $.loadScript('plugins/Tutorial-Status/js/js.storage.js');


      //  $.loadScript('plugins/Tutorial-View/js/tags.js');
    });

    codiad.tutorial = {

        // Allows relative `this.path` linkage
        perc_tutorial_size: _perc_tutorial_size,
        path: curpath,

        init: function() {

        //  $('#side-projects').tooltipster();
        //  $('#file-manager').tooltipster();
        //  $('#divtoc').tooltipster();
        //  $('#tutorialtemplate').tooltipster();
          $('#controls').tooltipster();
          $('#application-progress').tooltipster();
          $('#downeditor').tooltipster();
          $('#lock-left-sidebar').hide();

          storage=Storages.localStorage;

          var ts= storage.get("tutorial-size")==undefined?60:storage.get("tutorial-size");
          codiad.tutorial.perc_tutorial_size=ts;

           var checkExist=setInterval(function() {
             if ($('#application-progress').length > 0) {

                   $('#application-progress').slider({
                           range: "min",
                           min: 3,
                           max: 100,
                           animate: true,
                           slide: function(event, ui) {
                             //  $("#progress").html(ui.value + "%");
                             codiad.tutorial.moveTutorial(ui.value);
                           }
                     });
                     $('#application-progress').slider('value', codiad.tutorial.perc_tutorial_size);
                     $('#application-progress').hide();
                 clearInterval(checkExist);
               }else console.log("try")
             }, 20);
          var h=codiad.tutorial.getHeightTutorial();

          $( window ).bind("resize", function(){
            codiad.tutorial.resize();

          });

          $('#tutorialtemplate')
          .css({
              width: ($(window).width()-$('#sb-left').width())+'px' ,
              height: h+ 'px',
              left: $('#sb-left').width(),
              right: '10px',
              top: 0,
              bottom: '0px'
          });
          $('#tutorialcontent')
          .css({
              width: ($(window).width()-$('#sb-left').width())+'px' ,
              height: h+ 'px',
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

            $('#controls').click(function(){
              codiad.tutorial.showControls();
            });

            $('#downeditor').click(function(){
              var h=codiad.tutorial.getHeightTutorial();

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
                $('#application-progress').hide();


              }else{

                $('#tutorialcontent').css("height", h);
                $('#editor-top-bar').css("top", h);
                $('.collapse-dropdown').css("top",h);
                $('#tab-dropdown').css("top",h);
                $('#editor-region').css("top", h);
                $('#root-editor-wrapper').show();
                $('#cursor-position').show();
                $('#downeditor').addClass("icon-down-dir");
                $('#downeditor').removeClass("icon-up-dir");
                $(".editor").css("height",$(window).height() - h - $("#editor-bottom-bar").height()
                -  $("#editor-top-bar").height() - 12+"px");
                $('#application-progress').show();
                editor_open = true;
              }

            });
        },
        resize: function(){

              var leftw=$(window).width()-$("#sb-left").width();
              $("#tutorialtemplate").css("width", leftw+"px");
              $("#tutorialcontent").css("width", leftw+"px");
              var h=codiad.tutorial.getHeightTutorial();

              if(!editor_open)
              {
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
                $('#tutorialcontent').css("height", h);
                $('#editor-top-bar').css("top", h);
                $('.collapse-dropdown').css("top",h);
                $('#tab-dropdown').css("top",h);
                $('#editor-region').css("top", h);
                $('#root-editor-wrapper').show();
                $('#cursor-position').show();
                $('#downeditor').addClass("icon-down-dir");
                $('#downeditor').removeClass("icon-up-dir");
                $(".editor").css("height",$(window).height() - h - $("#editor-bottom-bar").height()
                -  $("#editor-top-bar").height() - 12+"px");
              }
            },
        moveTutorial: function(perc){
          codiad.tutorial.perc_tutorial_size = perc;
          storage.set("tutorial-size",perc);

          var h=codiad.tutorial.getHeightTutorial();
          if(editor_open)
          {
            $('#tutorialcontent').css("height", h);
            $('#editor-top-bar').css("top", h);
            $('.collapse-dropdown').css("top",h);
            $('#tab-dropdown').css("top",h);
            $('#editor-region').css("top", h);
            $('#root-editor-wrapper').show();
            $('#cursor-position').show();
            $('#downeditor').addClass("icon-down-dir");
            $('#downeditor').removeClass("icon-up-dir");
            $(".editor").css("height",$(window).height() - h - $("#editor-bottom-bar").height()
            -  $("#editor-top-bar").height() - 12+"px");
            codiad.editor.resize();
          }
        },
        getHeightTutorial: function(){
          var h = (($(window).height()*codiad.tutorial.perc_tutorial_size)/100)-20;
          return h;
        },
        openEditor:  function(element)
        {
          var h=codiad.tutorial.getHeightTutorial() ;
          if(!editor_open)
          {
            $('#tutorialcontent').css("height", h);
            $('#editor-top-bar').css("top", h);
            $('.collapse-dropdown').css("top", h );
            $('#tab-dropdown').css("top", h);
            $('#editor-region').css("top",h);
            $('#root-editor-wrapper').show();
            $('#cursor-position').show();
            $('#downeditor').addClass("icon-down-dir");
            $('#downeditor').removeClass("icon-up-dir");
            $(".editor").css("height",$(window).height() - h - $("#editor-bottom-bar").height()
            -  $("#editor-top-bar").height() - 12+"px");
            editor_open = true;
            $('#application-progress').show();

          }
          if(element !=null && element != undefined)
          {
            var container = $('#tutorialcontent'),
            scrollTo = $(element);

            container.animate({
              scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
            }, 200);
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
               $('#application-progress').hide();
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
        getHighlightMarker: function(code) {
            return markers[code];

        },
        setHighlightMarker: function(code,markerid) {
            return markers[code]=markerid;

        },
        replaceElementTag: function(targetSelector, newTagString) {
          var checkExist=setInterval(function() {
            if ($("#modal-content").length) {
                $(targetSelector).each(function(){
                  var newElem = $(newTagString, {html: $(this).html()});
                  $.each(this.attributes, function() {
                    newElem.attr(this.name, this.value);
                  });
                  $(this).replaceWith(newElem);
                });
                clearInterval(checkExist);
            }
          }, 20);

        },
        showControls: function(data_file) {
            var _this = this;
            codiad.modal.load(200, 'plugins/Tutorial-View/controls.php');
            //
            codiad.modal.hideOverlay();

        },
         open: function(tutorial) {
          // console.log(tutorial);
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

/*
 *  Place copyright or other info here...
 */

(function(global, $){

    // Define core
    var codiad = global.codiad,
        scripts= document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/',
        storage;
    var loading = false;

    var currrent_tutorial = "";

    // Instantiates plugin
    $(function() {

        codiad.console.init();
        $.loadScript('plugins/Tutorial-Status/js/toc.js');
        $.loadScript('plugins/Tutorial-Status/js/js.storage.js');


    });

    codiad.console = {

        // Allows relative `this.path` linkage
        path: curpath,

        init: function() {

            var _this = this;
                $.get(this.path+"template.php", function(data){

                $('#side-projects').before(data);
                _this.resize();

                //Set hidelistener
                $('#console-collapse').live('click', function(){
                    if (_this.hide) {
                        $('.console').hide();
                        $('.console-hr').hide();
                        $('#console-collapse').removeClass('icon-down-dir');
                        $('#console-collapse').addClass('icon-up-dir');
                        _this.hide = false;
                        //Set height
                        $('.console-sb').css("height","35px");
                        $('#toc').hide();
                    } else {
                        $('.console').show();
                        $('.console-hr').show();
                          $('#toc').show();
                        $('#console-collapse').removeClass('icon-up-dir');
                        $('#console-collapse').addClass('icon-down-dir');
                        _this.hide = true;
                        //Set height
                        $('.console-sb').css("height","300px");

                    }
                    _this.resize();
                });
                  //Load favorites, but only if settings already loaded
                if (_this.load) {
                    _this.__loadLocalStorageItems();
                } else {
                    _this.load = true; //wait for settings to be loaded
                }
           });

            //Prjects resizing - Get current and replace them
            var collapse    = codiad.project.projectsCollapse;
            var expand      = codiad.project.projectsExpand;
            codiad.project.projectsCollapse = function() {
                collapse();
                _this.resize();
                codiad.project._sideExpanded = false;
            };
            codiad.project.projectsExpand = function() {
                expand();
                _this.resize();
                codiad.project._sideExpanded = true;
            };

            amplify.subscribe('project.onOpen', function(){
      			     _this.saveTutorial(["tutorial"])
      			});
              /*
            amplify.subscribe('tutorial.save', function(){
                 _this.saveTutorial()
            });


            amplify.subscribe('tutorial.onParagraph', function(){
                 _this.saveTutorial()
            });
            amplify.subscribe('tutorial.onHighlight', function(){
                 _this.saveTutorial()
            });*/
            amplify.subscribe('tutorial.onToc', function(message){
                 _this.saveTutorial(message)

            });
            amplify.subscribe('active.onOpen', function(){

                _this.saveTutorial(["openfile",codiad.active.getPath()]);
            });

        },
           /**
         * Resize favorite area
         * @name resize
         */
        resize: function() {
            var projectSize = $('.sb-left-projects').height();
            var favoritesSize = $('.console-sb').height();

            $('.console-sb').css("bottom", projectSize+"px");
            $('.sb-left-content').css("bottom", projectSize+favoritesSize+"px");
            $('#toc').css("height",($('.console-sb').height())+"px");
        },
        loadDefaultTutorial: function(){
          loading=true;
          var checkExist=setInterval(function() {
            if ($('#file-manager').length) {
                    setTimeout(function(){
                      console.log("load intro");
                    //  codiad.tutorial.open("introduction");
                      storage=Storages.localStorage;
                      localStorage.clear();
                      storage.set('tutorial','introduction');

                      window.location.href = "?action=tutorial-view&tutorial=introduction";

                    }, 100);
                clearInterval(checkExist);
              }
            }, 20);

            loading=false;
        },
        getFromQuery: function( name, url ) {
            if (!url) url = location.href;
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regexS = "[\\?&]"+name+"=([^&#]*)";
            var regex = new RegExp( regexS );
            var results = regex.exec( url );
            return results == null ? null : results[1];
        },
        loadTutorial: function(){
          storage=Storages.localStorage;

      //    if(storage.get('tutorial') == "introduction") { this.loadDefaultTutorial();return;}
          loading=true;
          var checkExist=setInterval(function() {
            if ($('#file-manager').length) {
                    setTimeout(function(){


                      var t_name =   codiad.console.getFromQuery("tutorial",  window.location.href);

                      if(storage.get('tutorial')  != t_name)
                      {
                        window.location.href =  "?action=tutorial-view&tutorial="+storage.get('tutorial');
                      }
                      if(storage.get('tutorial') == null)
                      {
                        codiad.console.loadDefaultTutorial();

                      }

                      codiad.project.open(storage.get('tutorial'));
                      codiad.console.loadParagraph(storage.get('paragraph'));
                      codiad.console.loadTocPosition(storage.get('toc'));
                      codiad.console.highlightFiles(storage.get('hightlights'));
                      codiad.console.openFiles(storage.get('files'));
                      codiad.tutorial.closeEditor();
                      ;

                    }, 100);

                clearInterval(checkExist);

              }
            }, 20);


          loading=false;
        },
        saveDefaultTutorial: function(){
          var checkExist=setInterval(function() {
            if (loading) {
                  storage=Storages.localStorage;
                  storage.set('tutorial','uc1');
                  storage.set('paragraph','toc27');
                  storage.set('toc','ttoc27');
                  storage.set('files',["uc1/swift/swiftrun.swift","uc1/scripts/outputcombiner.sh"]);
                  var maphightlights = new Map();

                  maphightlights["uc1/R/example.r"]=["rgba(0,255,0,0.3)","2","4"];
                  maphightlights["uc1/R/testdir/test.sh"]=["rgba(0,255,0,0.3)","0","2"];
                  storage.set('hightlights',maphightlights);
              clearInterval(checkExist);
            }
          }, 20);

        },
        saveTutorial: function(message){
          storage=Storages.localStorage;
          switch(message[0]) {
            case "tutorial":

                storage.set('tutorial',codiad.project.getCurrent());
                break;
            case "toc":

                  // storage.set('toc',message[1]);
                break;
            case "openfile":
            console.log("open file "+message[1]);
                // var files = storage.get("files");
                // if(files == null)
                //   storage.set("files", [message[1]]);
                // else
                // {
                //   if( !(message[1] in files))
                //     files.push(message[1]);
                //   storage.set("files", files);
                //  console.log("save "+ files);
                // }
              
                break;
            default:
                console.log("no message");
        }

          /*
          var paid;
            $("#toc ul").children().each(function(i, value){if($(this).hasClass("toc-active"))paid=$(this).attr("id");});
            storage.set('paragraph',paid);
          storage.set('toc',"t"+paid);*/
          // storage.set('files',files);
          // storage.set('hightlights',highlights);
        },
        loadTOC: function() {
              storage=Storages.localStorage;
              this.resize();
              $('#toc').toc({
                    'selectors': 'h1,h2,h3', //elements to use as headings
                    'container': '#tutorialcontent', //element to find all selectors in
                    'smoothScrolling': true, //enable or disable smooth scrolling on click
                    'prefix': 'toc', //prefix for anchor tags and class names
                    'onHighlight': function(el) {
                        console.log("bha");
                			}, //called when a new section is highlighted
                    'highlightOnScroll': false, //add class to heading that is currently in focus
                    'highlightOffset': 100, //offset to trigger the next headline
                    'anchorName': function(i, heading, prefix) { //custom function for anchor name
                        return prefix+i;
                    },
                    'headerText': function(i, heading, $heading) { //custom function building the header-item text
                        return $heading.text();
                    },
                    'itemClass': function(i, heading, $heading, prefix) { // custom function for item class
                      return $heading[0].tagName.toLowerCase();
                }
                });
                if(storage.get('toc')==null)
                $('#toc li:first-child').addClass("toc-active");
                $('#toc ul:first-child').children().each(function (index, value) {
                  //  console.log(index);
                    var code= 'amplify.publish("tutorial.onToc", ["toc","ttoc'+index+'"]);';
                    $(this).attr('onclick', code);
                    $(this).attr('id', 'ttoc'+index);

                });
                //$("#toc ul").children().each(function(i, value){$(this).click(function(){codiad.console.saveTutorial() ;});});
        },
        loadParagraph: function (id)
        {

          if(id == "") return;
          var container = $('#tutorialcontent');
          var checkExist=setInterval(function() {
            if ($("#"+id).length) {
                     var scrollTo = $("#"+id);
                     $("#tutorialcontent").animate({
                         scrollTop:   scrollTo.offset().top - container.offset().top + container.scrollTop()

                     }, 200);
                clearInterval(checkExist);
              }
            }, 20);
            amplify.publish('tutorial.onParagraph', id);
        },
        loadTocPosition: function (id)
        {
          console.log("toc pos "+id);
          if(id == "") return;
          var container = $('#toc');
          var checkExist=setInterval(function() {
            if ($("#"+id).length) {
                     var scrollTo = $("#"+id);

                     $("#toc ul").children().each(function(i, value){ $(this).removeClass("toc-active");});

                     $("#toc").animate({
                         scrollTop:   scrollTo.offset().top - container.offset().top + container.scrollTop()
                     }, 200);
                     setTimeout(function(){$("#"+id).addClass("toc-active");},300);

                clearInterval(checkExist);
              }
            }, 20);

        },
        highlightFiles: function(files)
        {

          if(files == null || files == "undefined" || files.size == 0) return;
          setTimeout(function() {
              if ($("#root-editor-wrapper")) {
                    Object.keys(files).forEach(function(key) {

                          value = files[key];
                          var colorvalue=value[0];
                          var fromline=value[1];
                          var toline=value[2];
                          codiad.tutorial.highlightCode(key,fromline,toline,colorvalue);

                    });
                }
            }, 1000);
        },
        openFiles: function(files)
        {
          if(files == null || files == "undefined" || files.size == 0) return;
          setTimeout(function() {
              if ($("#root-editor-wrapper")) {
                    var file;
                    for(file in files)
                    {

                        codiad.tutorial.openCode(files[file]);
                    }

                }
            }, 1000);
        }

    };

})(this, jQuery);

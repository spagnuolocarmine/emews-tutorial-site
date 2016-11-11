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
            _this.hide = true;
            $.get(this.path+"template.php", function(data){

                $('#side-projects').before(data);
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

            amplify.subscribe('project.onOpen', function(tutorialpath){

                $("#loading").show();
                  codiad.tutorial.open(tutorialpath);
                  var old_turorial=storage.get('tutorial');
                  currrent_tutorial=tutorialpath;
                  console.log("Open new:"+tutorialpath+" Old:"+old_turorial);
                  var delay=0;
                  if(old_turorial != tutorialpath)
                  {
                     codiad.active.removeAll(false);
                    _this.saveTutorial(["tutorial",tutorialpath]);
                  }
                  var checkExist=setInterval(function() {
                    if ($('#toc').length > 0 && $('#tutorialcontent').length > 0 && $('#tutorialcontent').is(':empty')==0
                       && $("#tutorialname").html().indexOf(tutorialpath) != -1 ){
                              setTimeout(function(){
                                    codiad.console.loadTOC();
                                    codiad.tutorial.closeEditor();
                                    codiad.console.loadTocPosition(storage.get('toc'), storage.get('tutorial'));
                                    codiad.console.highlightFiles(storage.get('hightlights'));
                                    codiad.console.openFiles(storage.get('files'), storage.get('tutorial'));
                                      var checkExist2=setInterval(function() {
                                         if(  $(".editor").length > 0)
                                         {
                                           $(".editor").css("height",$(window).height()/2 - 34);

                                            $("#loading").hide();
                                            return;
                                           clearInterval(checkExist2);
                                         }
                                    }, 20);
                                    $("#loading").hide();
                              },200);
                        clearInterval(checkExist);
                      }
                    }, 20);


      			});

            amplify.subscribe('tutorial.onToc', function(message){
                 _this.saveTutorial(message);
                  codiad.console.loadTocPosition(storage.get('toc'), storage.get('tutorial'),message[2]);
            });
            amplify.subscribe('active.onOpen', function(path){
                _this.saveTutorial(["openfile",path]);
            });
            amplify.subscribe('active.onCloseButton', function(path){
                _this.saveTutorial(["closefile",path]);
            });

            _this.resize();

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
          storage=Storages.localStorage;
          localStorage.clear();
          storage.set('tutorial','introduction');
          window.location.href = "?action=tutorial-view";
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
          if(storage.get('tutorial') == null)
          {
            codiad.console.loadDefaultTutorial();
            return;

          }
          codiad.project.open(storage.get('tutorial'));

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
                storage.set('tutorial',message[1]);
                break;
            case "toc":

                var maptoc = storage.get("toc");
                if(maptoc == null)
                {
                  var tmpmap = new Map();
                  tmpmap[storage.get("tutorial")] = "";
                  storage.set("toc", tmpmap);
                }
                maptoc = storage.get("toc");
                maptoc[storage.get("tutorial")]= message[1];
                storage.set('toc',maptoc);
                break;
            case "openfile":
              //  console.log("open file "+message[1]);
                var mapfiles = storage.get("files");
                if(mapfiles == null)
                {
                  var tmpmap = new Map();
                  storage.set("files", tmpmap);
                }
                mapfiles = storage.get("files");
                if(mapfiles[storage.get("tutorial")] == null || mapfiles[storage.get("tutorial")] == undefined)
                  mapfiles[storage.get("tutorial")] = [];
                var found = $.inArray(message[1], mapfiles[storage.get("tutorial")]) > -1;
                if(!found)
                {
                    mapfiles[storage.get("tutorial")].push(message[1]);
                    storage.set('files',mapfiles);

                }
                break;
                case "closefile":
                    console.log("close file "+message[1]);
                    var mapfiles = storage.get("files");
                    if(mapfiles == null || mapfiles[storage.get("tutorial")] == undefined) break;
                    var index = mapfiles[storage.get("tutorial")].indexOf(message[1]);
                  //  var found = $.inArray(message[1], mapfiles[storage.get("tutorial")]) > -1;
                    if(index > -1)
                    {
                      // console.log("removed" + index);
                        mapfiles[storage.get("tutorial")].splice(index,1);
                        // console.log(  mapfiles[storage.get("tutorial")]);
                        storage.set('files',mapfiles);
                    }
                    break;
            default:
                console.log("no message");
          }
        },
        loadTOC: function() {
              storage=Storages.localStorage;
              $('#toc').empty();

              $('#toc').toc({
                    'selectors': 'h1,h2,h3', //elements to use as headings
                    'container': '#tutorialcontent', //element to find all selectors in
                    'smoothScrolling': true, //enable or disable smooth scrolling on click
                    'prefix': 'toc', //prefix for anchor tags and class names
                    'onHighlight': function(el) {

                			}, //called when a new section is highlighted
                    'highlightOnScroll': false, //add class to heading that is currently in focus
                    'highlightOffset': 400, //offset to trigger the next headline
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

                var map = storage.get('toc');
                if(map==null || map[storage.get('tutorial')] == null || map[storage.get('tutorial')] == undefined)
                $('#toc li:first-child').addClass("toc-active");
                $('#toc ul:first-child').children().each(function (index, value) {
                  //  console.log(value);
                    var code= 'amplify.publish("tutorial.onToc", ["toc","ttoc'+index+'"]);';
                    $(this).attr('onclick', code);
                    $(this).children().attr('href', 'javascript:void(0)');
                    $(this).attr('id', 'ttoc'+index);
                });
                codiad.console.resize();

        },
        loadTocPosition: function (map, tutorial, type)
        {
          if(type == "h" || type =="o") return;
          if(map == null || map[tutorial]== undefined || map[tutorial]=="")
          {
            $('#toc li:first-child').addClass("toc-active");
            return;
          }
          var id=map[tutorial];
          var container = $('#toc');
          var checkExist=setInterval(function() {
            if ($("#"+id).length  > 0) {
                     var scrollTo = $("#"+id);
                     $("#toc ul").children().each(function(i, value){
                       if(value.id == $("#"+id).get(0).id)
                        {
                              $("#"+id).addClass("toc-active");
                        }
                        else{
                              $(this).removeClass("toc-active");
                          }
                     });
                     $("#toc").animate({
                         scrollTop:   scrollTo.offset().top - container.offset().top + container.scrollTop()
                     }, 200);
                clearInterval(checkExist);
              }
            }, 20);

            var checkExist2=setInterval(function() {
              if ($("#"+id.substring(1)).length > 0   && $('#tutorialcontent').length > 0 && !$('#tutorialcontent').is(':empty')
                   ) {
                       //$("#tutorialname").html().indexOf(tutorial) !== -1
                       setTimeout(function(){
                       $("#tutorialcontent").animate({
                           scrollTop: $("#"+id.substring(1)).offset().top - $('#tutorialcontent').offset().top + $('#tutorialcontent').scrollTop()
                       }, 200);
                     },200);

                  clearInterval(checkExist2);
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
        openFiles: function(mapfiles, tutorial, _delay)
        {
          if(mapfiles == null) return;
          var files = mapfiles[tutorial];

          if(files == null || files == "undefined" || files.size == 0) {
            codiad.tutorial.closeEditor();
            return;
          }
          codiad.tutorial.openEditor();
          // setTimeout(function() {
          //     if ($("#root-editor-wrapper")) {
          var file;
          var delay=_delay;
          for(file in files)
          {
          //  delay=codiad.tutorial.openCode(files[file],delay);
              codiad.filemanager.openFile(files[file],true);
            //  console.log("Open "+files[file]+" index "+files[file].substring(0,files[file].lastIndexOf("/")));
            //

          //  console.log(delay);
          }


          // var f=function(tmp){
          //     console.log("Open "+tmp+" index "+tmp.substring(0,tmp.lastIndexOf("/")));
          //    codiad.filemanager.index(files[file2].substring(0,files[file2].lastIndexOf("/")),true);
          //
          // };
          // var c=setInterval(function() {
          //   if ($("#project-root").length) {
          //         var delay = 0;
          //           console.log(files);
          //         for(file2 in files)
          //         {
          //           var tmp=files[file2];
          //           setTimeout(f(tmp),delay);
          //           delay+=200;
          //         }
          //       clearInterval(c);
          //     }
          //   }, 20);




            //
            //     }
            // }, 10);
        }
        ,
        closeFiles: function(mapfiles, tutorial)
        {
          if(mapfiles == null) return;
          var files = mapfiles[tutorial];

          if(files == null || files == "undefined" || files.size == 0) {
            codiad.tutorial.closeEditor();
            return;
          }
      //    console.log(files);
        //  setTimeout(function() {
          //    if ($("#root-editor-wrapper")) {
                    var file;
                    var delay=0;
                    for(file in files)
                    {
                    //   console.log(files[file]);
                        if(codiad.active.sessions[files[file]] != null)
                          {
                              codiad.active.close(files[file]);
                              codiad.active.remove(files[file]);
                              codiad.active.removeDraft(files[file]);
                          }

                    //  codiad.active.closeWithoutNotify(files[file]);

                    }
                    return 300;

            //    }
          //  }, 10);
        }

    };

})(this, jQuery);

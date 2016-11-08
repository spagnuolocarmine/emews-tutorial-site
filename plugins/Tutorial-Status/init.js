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
            amplify.subscribe('active.onOpen', function(path){
                _this.saveTutorial(["openfile",path]);
            });
            amplify.subscribe('active.onClose', function(path){
                _this.saveTutorial(["closefile",path]);
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
                    //  codiad.console.loadParagraph(storage.get('paragraph'));
                      codiad.console.loadTocPosition(storage.get('toc'), storage.get('tutorial'));
                      codiad.console.highlightFiles(storage.get('hightlights'));
                      codiad.console.openFiles(storage.get('files'), storage.get('tutorial'));
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
              //  console.log("save toc "+message[1]);
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
              //  console.log("tutorial "+storage.get("tutorial"));
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
                var map = storage.get('toc');
                if(map==null || map[storage.get('tutorial')] == null || map[storage.get('tutorial')] == undefined)
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
        loadTocPosition: function (map, tutorial)
        {
          if(map == null) return;
          var id=map[tutorial];
        //  console.log(id);
          if(id == undefined) {console.log("exit");return;}
      //    console.log("toc pos "+id);
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

            var checkExist2=setInterval(function() {
              if ($("#"+id.substring(1)).length) {
                       $("#tutorialcontent").animate({
                           scrollTop:   $("#"+id.substring(1)).offset().top - $('#tutorialcontent').offset().top + $('#tutorialcontent').scrollTop()

                       }, 200);
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
        openFiles: function(mapfiles, tutorial)
        {
          if(mapfiles == null) return;
          var files = mapfiles[tutorial];
        
          if(files == null || files == "undefined" || files.size == 0) return;
          setTimeout(function() {
              if ($("#root-editor-wrapper")) {
                    var file;
                    var delay=0;
                    for(file in files)
                    {
                      delay=codiad.tutorial.openCode(files[file],delay);
                    }

                }
            }, 10);
        }

    };

})(this, jQuery);

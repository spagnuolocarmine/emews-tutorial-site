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

        codiad.Console.init();
        $.loadScript('plugins/Tutorial-Status/js/toc.js');

    });

    codiad.Console = {

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
                    } else {
                        $('.console').show();
                        $('.console-hr').show();
                        $('#console-collapse').removeClass('icon-up-dir');
                        $('#console-collapse').addClass('icon-down-dir');
                        _this.hide = true;
                        //Set height
                        $('.console-sb').css("height","300px");
                        $('#toc').css("height","280px");
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
        },

        /**
         *
         * This is where the core functionality goes, any call, references,
         * script-loads, etc...
         *
         */

         run: function(path) {
            alert('Run file '+path+" only sh and swift will be admitted, the output in console");
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
            $('#toc').css("height",($('.console-sb').width())+"px");
        },
        loadTOC: function() {

        this.resize();
        $('#toc').toc({
              'selectors': 'h1,h2,h3', //elements to use as headings
              'container': '#tutorialcontent', //element to find all selectors in
              'smoothScrolling': true, //enable or disable smooth scrolling on click
              'prefix': 'toc', //prefix for anchor tags and class names
              'onHighlight': function(el) {}, //called when a new section is highlighted
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
          $('#toc li:first-child').addClass("toc-active");
          $('#toc ul:first-child').children().each(function (index, value) {
            //  console.log(index);
              $(this).attr('id', 'ttoc'+index);

          });

        }

    };

})(this, jQuery);

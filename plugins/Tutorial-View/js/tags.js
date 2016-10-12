var markers = new Map();

// Create a new object based of the HTMLElement prototype
var highlightcodeProto = Object.create(HTMLElement.prototype);

// Set up the element.
highlightcodeProto.createdCallback = function() {
    // Create a Shadow Root
    var shadow = this.createShadowRoot();

    // Create a standard img element and set it's attributes.
    var span = document.createElement('span');
    span.innerHTML=this.innerHTML;

    // Add the image to the Shadow Root.
    shadow.appendChild(span);
    var code=this.getAttribute('code');
    var colorvalue=this.getAttribute('color');
    var fromline=this.getAttribute('from');
    var toline=this.getAttribute('to');

    if(colorvalue)
    var classcolorname=colorvalue.replace("(","").replace(")","").replace(",","").replace(",","").replace(",","").replace(".","_");

    var stylecolor="."+classcolorname+"{position: absolute;background:"+colorvalue+";z-index: 20;}";
    $("<div/>", {html: '&shy;<style>' + stylecolor + '</style>'}).appendTo("body");

    // Add an event listener to the image.
    span.addEventListener('click', function(e) {
        codiad.filemanager.openFile(code,true);

        codiad.filemanager.index(code.substring(0,code.lastIndexOf("/")),true);
        setTimeout(function(){
          if(codiad.active)
          codiad.active.gotoLine(fromline);
          var newmarker=codiad.editor.highlightCode(code,classcolorname,fromline,toline);;
          if(markers[code] != undefined && newmarker!=markers[code])
            codiad.editor.clearHighlightCode(code,markers[code]);
          markers[code]=newmarker;
          var parent;
          $(e.target).prevAll().each(function(i, value){

              switch (this.tagName) {
                    case "H3":
                      if(typeof parent === "undefined")  parent=this;
                      break;
                    case "H2":
                      if(typeof parent === "undefined")  parent=this;
                      break;
                    case "H1":
                      if(typeof parent === "undefined")  parent=this;
                      break;
                  }
            });
          //MOVE TOC
          var container = $('#toc'),
          scrollTo = $("#"+parent.getAttribute('tocid'));
          $("#toc ul").children().each(function(i, value){$(this).removeClass("toc-active");});
          $("#"+parent.getAttribute('tocid')).addClass("toc-active");
          $("#toc").animate({
              scrollTop:   scrollTo.offset().top - container.offset().top + container.scrollTop()

          }, 200);
          //MOVE FILE manager search li with code
          var lielementcode;
          var container = $('#file-manager');
          container.find("li").each(function(i, value){

              if($(this).find("a").attr("data-path") == code) lielementcode=this;

            });

          var scrollTo = $(lielementcode);
          $("#file-manager").animate({
              scrollTop:   scrollTo.offset().top - container.offset().top + container.scrollTop()

          }, 200);

        }, 100);

    });
    span.addEventListener('mouseenter', function(e) {

        span.style.textDecoration = "underline";
    });
    span.addEventListener('mouseleave', function(e) {

        span.style.textDecoration = "none";
    });

};
try {
  var highlightcode = document.registerElement('highlight-code', {
      prototype: highlightcodeProto
  });

} catch(e) {
  //  console.log('already exists', e);
}
// Register the new element.

// Create a new object based of the HTMLElement prototype
var opencodeProto = Object.create(HTMLElement.prototype);

// Set up the element.
opencodeProto.createdCallback = function() {
    // Create a Shadow Root
    var shadow = this.createShadowRoot();

    // Create a standard img element and set it's attributes.
    var span = document.createElement('span');
    span.innerHTML=this.innerHTML;

    // Add the image to the Shadow Root.
    shadow.appendChild(span);
    var code=this.getAttribute('code');
    // Add an event listener to the image.
    span.addEventListener('click', function(e) {
        codiad.filemanager.openFile(code,true);
        codiad.filemanager.index(code.substring(0,code.lastIndexOf("/")),true);

        setTimeout(function(){

          var parent;
          $(e.target).prevAll().each(function(i, value){

              switch (this.tagName) {
                    case "H3":
                      if(typeof parent === "undefined")  parent=this;
                      break;
                    case "H2":
                      if(typeof parent === "undefined")  parent=this;
                      break;
                    case "H1":
                      if(typeof parent === "undefined")  parent=this;
                      break;
                  }
            });
          //MOVE TOC
          var container = $('#toc'),
          scrollTo = $("#"+parent.getAttribute('tocid'));
          $("#toc ul").children().each(function(i, value){$(this).removeClass("toc-active");});
          $("#"+parent.getAttribute('tocid')).addClass("toc-active");
          $("#toc").animate({
              scrollTop:   scrollTo.offset().top - container.offset().top + container.scrollTop()

          }, 200);
          //MOVE FILE manager search li with code
          var lielementcode;
          var container = $('#file-manager');
          container.find("li").each(function(i, value){
            
              if($(this).find("a").attr("data-path") == code) lielementcode=this;

            });

          var scrollTo = $(lielementcode);
          $("#file-manager").animate({
              scrollTop:   scrollTo.offset().top - container.offset().top + container.scrollTop()

          }, 200);

        }, 100);

    });
    span.addEventListener('mouseenter', function(e) {

        span.style.textDecoration = "underline";
    });
    span.addEventListener('mouseleave', function(e) {

        span.style.textDecoration = "none";
    });

};
try {
  var opencode = document.registerElement('open-code', {
      prototype: opencodeProto
  });

} catch(e) {
  //  console.log('already exists', e);
}
// Register the new element.

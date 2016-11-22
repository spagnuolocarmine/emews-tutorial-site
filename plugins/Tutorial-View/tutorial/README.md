## Tutorial link type

- **Open Code**: ``` <open-code code="uc1/swift/swiftrun.swift">swiftrun.swift</open-code>```
- **Highlighs Code**: ``` <highlight-code code="uc1/swift/swiftrun.swift" color="rgba(255,255,255,0.3)" from="6" to="9">7-10</highlight-code>```
- **Refer to other tutorial**: ``` <modal-data data="plugins/Tutorial-View/tutorial/swiftt.html" ref="external_execution">leaf</modal-data>```
- **Normal link opened in other tab**: ```<a target="_blank" href="http://swift-lang.org/Swift-T">Swift/T website</a>```
- (Discouraged) **Normal link**: ```<a href="http://swift-lang.org/Swift-T">Swift/T website</a>```
##Styling ordered list
```
<style>
  #myol {
    margin-left: 5%;
    list-style: none outside none;
  }
  #myol li {
    counter-increment: item;
    list-style-type: none;
    margin-bottom: 5px;
  }
  #myol li:before {
    margin-right: 10px;
    content: counter(item)")";
    color: white;
    text-align: center;
    display: inline-block;
  }

</style>

<ol id="myol">
  <li>item</li>
  <li>item</li>
  <li>item</li>
  <li>item</li>
</ol>
```

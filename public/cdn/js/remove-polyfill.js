(function () {
    const typesToPatch = ['DocumentType', 'Element', 'CharacterData'],
        remove = function () {
            // The check here seems pointless, since we're not adding this
            // method to the prototypes of any any elements that CAN be the
            // root of the DOM. However, it's required by spec (see point 1 of
            // https://dom.spec.whatwg.org/#dom-childnode-remove) and would
            // theoretically make a difference if somebody .apply()ed this
            // method to the DOM's root node, so let's roll with it.
            if (this.parentNode != null) {
                this.parentNode.removeChild(this);
            }
        };

    for (let i=0; i<typesToPatch.length; i++) {
        const type = typesToPatch[i];
        if (window[type] && !window[type].prototype.remove) {
            window[type].prototype.remove = remove;
        }
    }
})();
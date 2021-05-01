/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// var loaderUtils = require("loader-utils");
// var path = require("path");

// module.exports = function getLocalIdent(loaderContext, localIdentName, localName, options) {
// 	if(!options.context) {
// 		if (loaderContext.rootContext) {
// 			options.context = loaderContext.rootContext;
// 		} else if (loaderContext.options && typeof loaderContext.options.context === "string") {
// 			options.context = loaderContext.options.context;
// 		} else {
// 			options.context = loaderContext.context;
// 		}
// 	}
// 	var request = path.relative(options.context, loaderContext.resourcePath);
// 	options.content = options.hashPrefix + request + "+" + localName;
// 	localIdentName = localIdentName.replace(/\[local\]/gi, localName);
// 	var hash = loaderUtils.interpolateName(loaderContext, localIdentName, options);
// 	return hash.replace(new RegExp("[^a-zA-Z0-9\\-_\u00A0-\uFFFF]", "g"), "-").replace(/^((-?[0-9])|--)/, "_$1");
// };

import incstr from 'incstr';

//region CSS Scope Minify
const createUniqueIdGenerator = () => {
    const index = {};

    const generateNextId = incstr.idGenerator({
        // Removed "d" letter to avoid accidental "ad" construct.
        // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
        // NOTE: allow "d" letter due to combination of UPPERCASES-lowercases
        alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789_-'
    });

    return (name) => {
        if (index[name]) {
            return index[name];
        }

        let nextId;

        do {
            // Class name cannot start with a number.
            nextId = generateNextId();
        } while (/^[0-9_-]/.test(nextId));

        index[name] = generateNextId();
        // console.log(`${name} has id = ${index[name]}`);

        return index[name];
    };
};

const idLocal = createUniqueIdGenerator(), idComponent = createUniqueIdGenerator();
const generateScopedName = (localName, resourcePath) => {
    const componentName = resourcePath.split('/').slice(-2).join('/');
    return idComponent(componentName).toUpperCase() + idLocal(localName);
};

const getLocalIdent = (context, localIdentName, localName) => generateScopedName(localName, context.resourcePath);
global.getLocalIdent = getLocalIdent;
//endregion

import emoji from 'emoji-parser';

emoji.init().update();


/*! https://github.com/blockmar/slackdown by @blockmar | MIT license */
;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.slackdown = factory();
    }
}(this, () => {

    var payloads = (tag, start) => {
        if (!start) {
            start = 0;
        }
        var length = tag.length;
        return pipeSplit(tag.substr(start, length - start));
    };

    var pipeSplit = payload => {
        return payload.split('|');
    };

    var tag = (tag, attributes, payload) => {
        if (!payload) {
            payload = attributes;
            attributes = {};
        }

        var html = "<".concat(tag);
        for (var attribute in attributes) {
            if (attributes.hasOwnProperty(attribute)) {
                html = html.concat(' ', attribute, '="', attributes[attribute], '"');
            }
        }
        return html.concat('>', payload, '</', tag, '>');
    };

    var matchTag = match => {
        var action = match[1].substr(0, 1),
            p;

        switch (action) {
            case "!":
                return tag("span", {
                    class: "slack-cmd"
                }, payloads(match[1], 1)[0]);
            case "#":
                p = payloads(match[1], 2);
                return tag("span", {
                    class: "slack-channel"
                }, (p.length == 1 ? p[0] : p[1]));
            case "@":
                p = payloads(match[1], 2);
                var name = p.length > 1 ? p[1] : ((users['U' + p[0]] && users['U' + p[0]].name) ? users['U' + p[0]].name : p[0]);
                return tag("span", {
                    class: "slack-user"
                }, name);
            default:
                p = payloads(match[1]);
                return tag("a", {
                    href: p[0]
                }, (p.length == 1 ? p[0] : p[1]));
        }
    };

    var matchBold = match => {
        return safeMatch(match, tag("strong", payloads(match[1])));
    };

    var matchStrike = match => {
        return safeMatch(match, tag("strike", payloads(match[1])));
    };

    var matchItalic = match => {
        return safeMatch(match, tag("em", payloads(match[1])));
    };

    var matchFixed = match => {
        return safeMatch(match, tag("code", payloads(match[1])));
    };

    var matchCodeBlock = match => {
        return safeMatch(match, tag("codeBlock", payloads(match[1])));
    };

    var isWhiteSpace = input => {
        return /^\s?$/.test(input);
    };


    var safeMatch = (match, tag) => {
        var prefix_ok = match.index == 0;
        var postfix_ok = match.index == match.input.length - match[0].length;

        if (!prefix_ok) {
            var charAtLeft = match.input.substr(match.index - 1, 1);
            prefix_ok = isWhiteSpace(charAtLeft);
        }

        if (!postfix_ok) {
            var charAtRight = match.input.substr(match.index + match[0].length, 1);
            postfix_ok = isWhiteSpace(charAtRight);
        }

        if (prefix_ok && postfix_ok) {
            return tag;
        }
        return false;
    };

    var publicParse = (text) => {

        if (typeof text === 'string') {
            var patterns = [{
                p: /<(.*?)>/g,
                cb: matchTag
            }, {
                p: /\*([^\*]*?)\*/g,
                cb: matchBold
            }, {
                p: /_([^_]*?)_/g,
                cb: matchItalic
            }, {
                p: /`([^`]*?)`/g,
                cb: matchFixed
            }, {
                p: /```([^```]*?)```/g,
                cb: matchCodeBlock
            }, {
                p: /~([^\~]*?)~/g,
                cb: matchStrike
            }];

            for (var p = 0; p < patterns.length; p++) {

                var pattern = patterns[p],
                    original = text,
                    result;

                while ((result = pattern.p.exec(original)) !== null) {
                    var replace = pattern.cb(result);

                    if (replace) {
                        text = text.replace(result[0], replace);
                    }
                }
            }
        }

        return text;
    };
    var users = [];
    return (text, Msgusers) => {
        users = Msgusers;
        text = publicParse(text);
        return emoji.parse(text, 'http://www.emoji-cheat-sheet.com/graphics/emojis');
    }

}));
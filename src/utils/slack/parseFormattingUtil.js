import emoji from 'emoji-parser';

emoji.init().update();


export
default class {
    constructor(text, users, notify = false) {

        this.users = users;
        this.rawText = text;
        this.notify = notify;

        this.parsed = this.parse(text);
    }

    parse(text) {
        let parsed = this._parse(text);

        if (!this.notify)
            parsed = this._parseEmoji(parsed);

        return parsed;
    }


    _parseEmoji(text) {
        return emoji.parse(text, 'http://www.emoji-cheat-sheet.com/graphics/emojis');
    }

    _parse(text) {

        if (typeof text === 'string') {
            var patterns = [{
                p: /<(.*?)>/g,
                cb: this._matchTag.bind(this)
            }, {
                p: /\*([^\*]*?)\*/g,
                cb: this._matchBold.bind(this)
            }, {
                p: /_([^_]*?)_/g,
                cb: this._matchItalic.bind(this)
            }, {
                p: /`([^`]*?)`/g,
                cb: this._matchCode.bind(this)
            }, {
                p: /```([^```]*?)```/g,
                cb: this._matchCodeBlock.bind(this)
            }, {
                p: /~([^\~]*?)~/g,
                cb: this._matchStrike.bind(this)
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
    }

    _payloads(tag, start) {
        if (!start) {
            start = 0;
        }
        var length = tag.length;
        return this._pipeSplit(tag.substr(start, length - start));
    }

    _pipeSplit(text) {
        return text.split('|');
    }

    _generateTag(tag, attributes, payload) {
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
    }

    _matchTag(match) {
        var action = match[1].substr(0, 1);


        switch (action) {
            case "!":
                var p = this._payloads(match[1], 1)[0];

                if (this.notify)
                    return p;


                return this._generateTag("span", {
                    class: "slack-cmd"
                }, p);
            case "#":
                var p = this._payloads(match[1], 2);

                if (this.notify)
                    return '#' + (p.length == 1 ? p[0] : p[1]);

                return this._generateTag("span", {
                    class: "slack-channel"
                }, (p.length == 1 ? p[0] : p[1]));
            case "@":
                var p = this._payloads(match[1], 2);


                var name = p.length > 1 ? p[1] : ((this.users['U' + p[0]] && this.users['U' + p[0]].name) ? this.users['U' + p[0]].name : p[0]);

                if (this.notify)
                    return '@' + name;

                return this._generateTag("span", {
                    class: "slack-user"
                }, name);
            default:
                var p = this._payloads(match[1]);
                if (this.notify)
                    return (p.length == 1 ? p[0] : p[1])
                return this._generateTag("a", {
                    href: p[0]
                }, (p.length == 1 ? p[0] : p[1]));
        }
    }

    _matchBold(match) {
        return this._safeMatch(match, this._generateTag('strong', this._payloads(match[1])));
    }

    _matchStrike(match) {
        return this._safeMatch(match, this._generateTag("strike", this._payloads(match[1])));
    }

    _matchItalic(match) {
        return this._safeMatch(match, this._generateTag("em", this._payloads(match[1])));
    }

    _matchCode(match) {
        return this._safeMatch(match, this._generateTag("code", this._payloads(match[1])));
    }

    _matchCodeBlock(match) {
        return this._safeMatch(match, this._generateTag("codeBlock", this._payloads(match[1])));
    }

    _isWhiteSpace(input) {
        return /^\s?$/.test(input);
    }

    _safeMatch(match, tag) {
        var prefix_ok = match.index == 0;
        var postfix_ok = match.index == match.input.length - match[0].length;

        if (!prefix_ok) {
            var charAtLeft = match.input.substr(match.index - 1, 1);
            prefix_ok = this._isWhiteSpace(charAtLeft);
        }

        if (!postfix_ok) {
            var charAtRight = match.input.substr(match.index + match[0].length, 1);
            postfix_ok = this._isWhiteSpace(charAtRight);
        }

        if (prefix_ok && postfix_ok) {
            return tag;
        }
        return false;
    }
}
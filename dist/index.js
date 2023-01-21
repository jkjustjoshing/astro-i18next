import module2 from "module";
import path2 from "path";
import * as url2 from "url";
const require = module2.createRequire(import.meta.url);
const __filename = url2.fileURLToPath(import.meta.url);
const __dirname = path2.dirname(__filename);

var g = {
    config: {
      defaultLocale: "cimode",
      locales: [],
      namespaces: "translation",
      defaultNamespace: "translation",
      load: ["server"],
      routes: {},
      flatRoutes: {},
      showDefaultLocale: !1,
    },
  },
  x = (e) => {
    let n = {};
    for (let i in e) i === "routes" && (n = I(e[i])), (g.config[i] = e[i]);
    g.config.flatRoutes = n;
  },
  m = (e) => ({ ...g.config, ...e }),
  I = (e, n = [], i = [], o = null) => {
    let r = o || {};
    for (let t in e)
      if (typeof e[t] == "object" && e[t] !== null)
        I(
          e[t],
          [...n, t],
          [
            ...i,
            Object.prototype.hasOwnProperty.call(e[t], "index")
              ? e[t].index
              : t,
          ],
          r
        );
      else {
        let l = "/" + n.join("/"),
          s = "/" + i.join("/");
        t === "index"
          ? ((r[l] = s), (l += "/" + t), (s += "/" + t), (r[l] = s))
          : ((l += "/" + t), (s += "/" + e[t]), (r[l] = s));
      }
    return r;
  };
import d, { t as b, exists as k } from "i18next";
import { fileURLToPath as h } from "url";
import y from "@proload/core";
import P from "@proload/plugin-tsm";
var A = async (e, n) => {
    let i = h(e),
      o;
    if (n) {
      let r = /^\.*\//.test(n) ? n : `./${n}`;
      o = h(new URL(r, e));
    }
    return (
      y.use([P]),
      await y("astro-i18next", { mustExist: !1, cwd: i, filePath: o })
    );
  },
  $ = (e, n) => {
    let i = e.indexOf(n);
    e.splice(i, 1), e.unshift(n);
  },
  R = (e, n, i = null) => {
    if (!k(e, { ns: i }))
      return (
        console.warn(`WARNING(astro-i18next): missing translation key ${e}.`), n
      );
    let o = b(e, { ns: i }),
      r = /<([\w\d]+)([^>]*)>/gi,
      t = n.match(r);
    if (!t)
      return (
        console.warn(
          "WARNING(astro-i18next): default slot does not include any HTML tag to interpolate! You should use the `t` function directly."
        ),
        o
      );
    let l = [];
    t.forEach((a) => {
      let [, c, f] = r.exec(a);
      l.push({ name: c, attributes: f }), r.exec("");
    });
    let s = o;
    for (let a = 0; a < l.length; a++) {
      let c = l[a];
      (s = s.replaceAll(`<${a}>`, `<${c.name}${c.attributes}>`)),
        (s = s.replaceAll(`</${a}>`, `</${c.name}>`));
    }
    return s;
  },
  w = (e) => {
    let n = ["strong", "br", "em", "i", "b"],
      i = [];
    d.options &&
      (i = [
        "keySeparator",
        "nsSeparator",
        "pluralSeparator",
        "contextSeparator",
      ]
        .map((s) => {
          if (d.options[s]) return { key: s, str: d.options[s] };
        })
        .filter(function (s) {
          return typeof s < "u";
        }));
    let o = /<([\w\d]+)([^>]*)>/gi,
      r = e.match(o);
    if (!r)
      return (
        console.warn(
          "WARNING(astro-i18next): default slot does not include any HTML tag to interpolate! You should use the `t` function directly."
        ),
        e
      );
    let t = [];
    r.forEach((s) => {
      let [, a, c] = o.exec(s);
      t.push({ name: a, attributes: c }), o.exec("");
    });
    let l = e.replace(/\s+/g, " ").trim();
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      (n.includes(a.name) && a.attributes.trim().length === 0) ||
        ((l = l.replaceAll(
          new RegExp(`<${a.name}[^>]*?\\s*\\/>`, "gi"),
          `<${s}/>`
        )),
        (l = l.replaceAll(`<${a.name}${a.attributes}>`, `<${s}>`)),
        (l = l.replaceAll(`</${a.name}>`, `</${s}>`)));
    }
    for (let s = 0; s < i.length; s++) {
      let { key: a, str: c } = i[s];
      l.includes(c) &&
        console.warn(
          `WARNING(astro-i18next): "${c}" was found in a <Trans> translation key, but it is also used as ${a}. Either explicitly set an i18nKey or change the value of ${a}.`
        );
    }
    return l;
  },
  S = (e = "/", n = null, i = import.meta.env.BASE_URL) => {
    n || (n = d.language);
    let o = e.split("/").filter((f) => f !== ""),
      r = i.split("/").filter((f) => f !== "");
    JSON.stringify(o).startsWith(JSON.stringify(r).replace(/]+$/, "")) &&
      o.splice(0, r.length),
      (e = o.length === 0 ? "" : o.join("/")),
      (i = r.length === 0 ? "/" : "/" + r.join("/") + "/");
    let {
      flatRoutes: t,
      showDefaultLocale: l,
      defaultLocale: s,
      locales: a,
    } = g.config;
    if (!a.includes(n))
      return (
        console.warn(
          `WARNING(astro-i18next): "${n}" locale is not supported, add it to the locales in your astro config.`
        ),
        `${i}${e}`
      );
    if (o.length === 0) return l ? `${i}${n}` : n === s ? i : `${i}${n}`;
    if (n === s) {
      let f = Object.keys(t).find((u) => t[u] === "/" + e);
      typeof f < "u" && (o = f.split("/").filter((u) => u !== ""));
    }
    for (let f of a)
      if (o[0] === f) {
        o.shift();
        break;
      }
    (l || n !== s) && (o = [n, ...o]);
    let c = i + o.join("/");
    return Object.prototype.hasOwnProperty.call(t, c.replace(/\/$/, ""))
      ? t[c.replace(/\/$/, "")]
      : c;
  },
  O = (e, n = null, i = import.meta.env.BASE_URL) => {
    let [o, , r, ...t] = e.split("/");
    return o + "//" + r + S(t.join("/"), n, i);
  },
  N = (e) => {
    e = e.replace(/^\/+/g, "");
    let { defaultLocale: n, locales: i } = g.config,
      o = e.split("/");
    if (
      JSON.stringify(o) === JSON.stringify([""]) ||
      JSON.stringify(o) === JSON.stringify(["", ""])
    )
      return n;
    let r = [...i];
    r = r.filter((t) => t !== n);
    for (let t of r) if (o[0] === t) return t;
    return n;
  },
  p = (e) => {
    let n = Array.isArray(e),
      i = n ? "[" : "{";
    for (let o in e) {
      if (e[o] === null || e[o] === void 0) continue;
      let r = null;
      switch (typeof e[o]) {
        case "string": {
          r = `"${e[o]}"`;
          break;
        }
        case "number":
        case "boolean": {
          r = e[o];
          break;
        }
        case "object": {
          r = p(e[o]);
          break;
        }
        case "function": {
          r = e[o].toString().replace(/\s+/g, " ");
          break;
        }
        case "symbol": {
          r = `Symbol("${e[o].description}")`;
          break;
        }
        default:
          break;
      }
      i += n ? `${r},` : `"${o}": ${r},`;
    }
    return `${i}${n ? "]" : "}"}`;
  };
import { fileURLToPath as v } from "url";
var F = (e) => {
    let n = e == null ? void 0 : e.configPath;
    return {
      name: "astro-i18next",
      hooks: {
        "astro:config:setup": async ({ config: i, injectScript: o }) => {
          var l;
          let r = await A(i.root, n);
          if (n && !(r != null && r.value))
            throw new Error(
              `[astro-i18next]: Could not find a config file at ${JSON.stringify(
                n
              )}. Does the file exist?`
            );
          let t = m(r == null ? void 0 : r.value);
          if (!t.defaultLocale || t.defaultLocale === "")
            throw new Error(
              "[astro-i18next]: you must set a `defaultLocale` in your astro-i18next config!"
            );
          if (
            (t.locales || (t.locales = [t.defaultLocale]),
            t.locales.includes(t.defaultLocale) ||
              t.locales.unshift(t.defaultLocale),
            t.locales[0] !== t.defaultLocale && $(t.locales, t.defaultLocale),
            t.load.includes("server"))
          ) {
            let s = {
                supportedLngs: t.locales,
                fallbackLng: t.locales,
                ns: t.namespaces,
                defaultNS: t.defaultNamespace,
                initImmediate: !1,
                backend: {
                  loadPath: v(i.publicDir) + "locales/{{lng}}/{{ns}}.json",
                },
                ...t.i18nextServer,
              },
              c = {
                ...{ fsBackend: "i18next-fs-backend" },
                ...t.i18nextServerPlugins,
              },
              { imports: f, i18nextInit: u } = L(s, c);
            f += 'import {initAstroI18next} from "astro-i18next";';
            let C = `initAstroI18next(${p(t)});`;
            o("page-ssr", f + u + C);
          }
          if ((l = t.load) != null && l.includes("client")) {
            let s = {
                supportedLngs: t.locales,
                fallbackLng: t.locales,
                ns: t.namespaces,
                defaultNS: t.defaultNamespace,
                detection: { order: ["htmlTag"], caches: [] },
                backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
                ...t.i18nextClient,
              },
              c = {
                ...{
                  httpBackend: "i18next-http-backend",
                  LanguageDetector: "i18next-browser-languagedetector",
                },
                ...t.i18nextClientPlugins,
              },
              { imports: f, i18nextInit: u } = L(s, c);
            o("before-hydration", f + u);
          }
        },
      },
    };
  },
  L = (e, n) => {
    let i = 'import i18next from "i18next";',
      o = "i18next";
    if (Object.keys(n).length > 0)
      for (let r of Object.keys(n))
        n[r] !== null &&
          ((i += `import ${r} from "${n[r]}";`),
          (o += `.use(${r.replace(/[{}]/g, "")})`));
    return (o += `.init(${p(e)});`), { imports: i, i18nextInit: o };
  };
function M(e) {
  x(e);
}
export {
  g as AstroI18next,
  w as createReferenceStringFromHTML,
  F as default,
  N as detectLocaleFromPath,
  M as initAstroI18next,
  R as interpolate,
  S as localizePath,
  O as localizeUrl,
};

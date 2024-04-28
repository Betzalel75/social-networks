!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = t())
      : "function" == typeof define && define.amd
      ? define(t)
      : ((e = e || self).Alpine = t());
  })(this, function () {
    "use strict";
    function e(e) {
      for (var t = e.concat(), n = 0; n < t.length; ++n)
        for (var i = n + 1; i < t.length; ++i) t[n] === t[i] && t.splice(i--, 1);
      return t;
    }
    function t() {
      return (
        navigator.userAgent.includes("Node.js") ||
        navigator.userAgent.includes("jsdom")
      );
    }
    function n(e, t, n = {}) {
      return new Function(
        ["$data", ...Object.keys(n)],
        `var result; with($data) { result = ${e} }; return result`
      )(t, ...Object.values(n));
    }
    function i(e, t, n = {}) {
      return new Function(
        ["dataContext", ...Object.keys(n)],
        `with(dataContext) { ${e} }`
      )(t, ...Object.values(n));
    }
    function s(e) {
      const t = a(e.name);
      return /x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)/.test(
        t
      );
    }
    function r(e, t) {
      return Array.from(e.attributes)
        .filter(s)
        .map((e) => {
          const t = a(e.name),
            n = t.match(
              /x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)/
            ),
            i = t.match(/:([a-zA-Z\-:]+)/),
            s = t.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
          return {
            type: n ? n[1] : null,
            value: i ? i[1] : null,
            modifiers: s.map((e) => e.replace(".", "")),
            expression: e.value,
          };
        })
        .filter((e) => !t || e.type === t);
    }
    function a(e) {
      return e.startsWith("@")
        ? e.replace("@", "x-on:")
        : e.startsWith(":")
        ? e.replace(":", "x-bind:")
        : e;
    }
    function o(e, t, n = !1) {
      if (n) return t();
      const i = r(e, "transition");
      if (i.length < 1) return t();
      c(
        e,
        (i.find((e) => "enter" === e.value) || { expression: "" }).expression
          .split(" ")
          .filter((e) => "" !== e),
        (
          i.find((e) => "enter-start" === e.value) || { expression: "" }
        ).expression
          .split(" ")
          .filter((e) => "" !== e),
        (i.find((e) => "enter-end" === e.value) || { expression: "" }).expression
          .split(" ")
          .filter((e) => "" !== e),
        t,
        () => {}
      );
    }
    function l(e, t, n = !1) {
      if (n) return t();
      const i = r(e, "transition");
      if (i.length < 1) return t();
      c(
        e,
        (i.find((e) => "leave" === e.value) || { expression: "" }).expression
          .split(" ")
          .filter((e) => "" !== e),
        (
          i.find((e) => "leave-start" === e.value) || { expression: "" }
        ).expression
          .split(" ")
          .filter((e) => "" !== e),
        (i.find((e) => "leave-end" === e.value) || { expression: "" }).expression
          .split(" ")
          .filter((e) => "" !== e),
        () => {},
        t
      );
    }
    function c(e, t, n, i, s, r) {
      const a = e.__x_original_classes || [];
      e.classList.add(...n),
        e.classList.add(...t),
        requestAnimationFrame(() => {
          const o =
            1e3 * Number(getComputedStyle(e).transitionDuration.replace("s", ""));
          s(),
            requestAnimationFrame(() => {
              e.classList.remove(...n.filter((e) => !a.includes(e))),
                e.classList.add(...i),
                setTimeout(() => {
                  r(),
                    e.isConnected &&
                      (e.classList.remove(...t.filter((e) => !a.includes(e))),
                      e.classList.remove(...i.filter((e) => !a.includes(e))));
                }, o);
            });
        });
    }
    function u(e, t, n, i) {
      const {
        single: s,
        bunch: a,
        iterator1: c,
        iterator2: u,
      } = (function (e) {
        const t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
          n = e.match(/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/);
        if (!n) return;
        const i = {};
        i.bunch = n[2].trim();
        const s = n[1].trim().replace(/^\(|\)$/g, ""),
          r = s.match(t);
        r
          ? ((i.single = s.replace(t, "").trim()),
            (i.iterator1 = r[1].trim()),
            r[2] && (i.iterator2 = r[2].trim()))
          : (i.single = s);
        return i;
      })(n);
      var d = e.evaluateReturnExpression(t, a),
        f = t;
      d.forEach((n, a, l) => {
        const d = (function (e, t, n, i, s, a, o, l) {
          const c = r(t, "bind").filter((e) => "key" === e.value)[0];
          let u = { [n]: a };
          i && (u[i] = o);
          s && (u[s] = l);
          return c ? e.evaluateReturnExpression(t, c.expression, () => u) : o;
        })(e, t, s, c, u, n, a, l);
        let m = f.nextElementSibling;
        if (m && void 0 !== m.__x_for_key) {
          if (m.__x_for_key !== d)
            for (var p = m; p; ) {
              if (p.__x_for_key === d) {
                t.parentElement.insertBefore(p, m), (m = p);
                break;
              }
              p =
                !(
                  !p.nextElementSibling ||
                  void 0 === p.nextElementSibling.__x_for_key
                ) && p.nextElementSibling;
            }
          delete m.__x_for_key,
            (m.__x_for_alias = s),
            (m.__x_for_value = n),
            e.updateElements(m, () => ({ [m.__x_for_alias]: m.__x_for_value }));
        } else {
          const r = document.importNode(t.content, !0);
          t.parentElement.insertBefore(r, m),
            (m = f.nextElementSibling),
            o(m, () => {}, i),
            (m.__x_for_alias = s),
            (m.__x_for_value = n),
            e.initializeElements(m, () => ({
              [m.__x_for_alias]: m.__x_for_value,
            }));
        }
        (m.__x_for_key = d), (f = m);
      });
      for (
        var m =
          !(
            !f.nextElementSibling || void 0 === f.nextElementSibling.__x_for_key
          ) && f.nextElementSibling;
        m;
  
      ) {
        const e = m,
          t = m.nextElementSibling;
        l(m, () => {
          e.remove();
        }),
          (m = !(!t || void 0 === t.__x_for_key) && t);
      }
    }
    function d(t, n, i, s, r) {
      var a = t.evaluateReturnExpression(n, s, r);
      if ("value" === i)
        if (
          (void 0 === a && s.match(/\./).length && (a = ""), "radio" === n.type)
        )
          n.checked = n.value == a;
        else if ("checkbox" === n.type)
          if (Array.isArray(a)) {
            let e = !1;
            a.forEach((t) => {
              t == n.value && (e = !0);
            }),
              (n.checked = e);
          } else n.checked = !!a;
        else
          "SELECT" === n.tagName
            ? (function (e, t) {
                const n = [].concat(t).map((e) => e + "");
                Array.from(e.options).forEach((e) => {
                  e.selected = n.includes(e.value || e.text);
                });
              })(n, a)
            : (n.value = a);
      else if ("class" === i)
        if (Array.isArray(a)) {
          const t = n.__x_original_classes || [];
          n.setAttribute("class", e(t.concat(a)).join(" "));
        } else if ("object" == typeof a)
          Object.keys(a).forEach((e) => {
            a[e]
              ? e.split(" ").forEach((e) => n.classList.add(e))
              : e.split(" ").forEach((e) => n.classList.remove(e));
          });
        else {
          const t = n.__x_original_classes || [],
            i = a.split(" ");
          n.setAttribute("class", e(t.concat(i)).join(" "));
        }
      else
        ["disabled", "readonly", "required", "checked", "hidden"].includes(i)
          ? a
            ? n.setAttribute(i, "")
            : n.removeAttribute(i)
          : n.setAttribute(i, a);
    }
    function f(e, t, n, i, s, r = {}) {
      if (i.includes("away")) {
        const a = (o) => {
          t.contains(o.target) ||
            (t.offsetWidth < 1 && t.offsetHeight < 1) ||
            (m(e, s, o, r),
            i.includes("once") && document.removeEventListener(n, a));
        };
        document.addEventListener(n, a);
      } else {
        const a = i.includes("window")
            ? window
            : i.includes("document")
            ? document
            : t,
          o = (t) => {
            ((function (e) {
              return ["keydown", "keyup"].includes(e);
            })(n) &&
              (function (e, t) {
                let n = t.filter(
                  (e) => !["window", "document", "prevent", "stop"].includes(e)
                );
                if (0 === n.length) return !1;
                if (1 === n.length && n[0] === p(e.key)) return !1;
                const i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter(
                  (e) => n.includes(e)
                );
                if (((n = n.filter((e) => !i.includes(e))), i.length > 0)) {
                  if (
                    i.filter(
                      (t) => (
                        ("cmd" !== t && "super" !== t) || (t = "meta"),
                        e[`${t}Key`]
                      )
                    ).length === i.length &&
                    n[0] === p(e.key)
                  )
                    return !1;
                }
                return !0;
              })(t, i)) ||
              (i.includes("prevent") && t.preventDefault(),
              i.includes("stop") && t.stopPropagation(),
              m(e, s, t, r),
              i.includes("once") && a.removeEventListener(n, o));
          };
        a.addEventListener(n, o);
      }
    }
    function m(e, t, n, i) {
      e.evaluateCommandExpression(n.target, t, () => ({ ...i(), $event: n }));
    }
    function p(e) {
      switch (e) {
        case "/":
          return "slash";
        case " ":
        case "Spacebar":
          return "space";
        default:
          return e
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            .replace(/[_\s]/, "-")
            .toLowerCase();
      }
    }
    function h(e, t, n, i, s = {}) {
      var r =
        "select" === t.tagName.toLowerCase() ||
        ["checkbox", "radio"].includes(t.type) ||
        n.includes("lazy")
          ? "change"
          : "input";
      const a = (function (e, t, n, i) {
        var s = "";
        s =
          "checkbox" === t.type
            ? Array.isArray(e.$data[i])
              ? `$event.target.checked ? ${i}.concat([$event.target.value]) : ${i}.filter(i => i !== $event.target.value)`
              : "$event.target.checked"
            : "select" === t.tagName.toLowerCase() && t.multiple
            ? n.includes("number")
              ? "Array.from($event.target.selectedOptions).map(option => { return parseFloat(option.value || option.text) })"
              : "Array.from($event.target.selectedOptions).map(option => { return option.value || option.text })"
            : n.includes("number")
            ? "parseFloat($event.target.value)"
            : n.includes("trim")
            ? "$event.target.value.trim()"
            : "$event.target.value";
        "radio" === t.type &&
          (t.hasAttribute("name") || t.setAttribute("name", i));
        return `${i} = ${s}`;
      })(e, t, n, i);
      f(e, t, r, n, a, s);
    }
    class x {
      constructor(e) {
        this.$el = e;
        const t = this.$el.getAttribute("x-data"),
          s = "" === t ? "{}" : t,
          r = this.$el.getAttribute("x-init"),
          a = this.$el.getAttribute("x-created"),
          o = this.$el.getAttribute("x-mounted"),
          l = n(s, {});
        var c;
        (this.$data = this.wrapDataInObservable(l)),
          (l.$el = this.$el),
          (l.$refs = this.getRefsProxy()),
          (this.nextTickStack = []),
          (l.$nextTick = (e) => {
            this.nextTickStack.push(e);
          }),
          r &&
            ((this.pauseReactivity = !0),
            (c = n(this.$el.getAttribute("x-init"), this.$data)),
            (this.pauseReactivity = !1)),
          a &&
            (console.warn(
              'AlpineJS Warning: "x-created" is deprecated and will be removed in the next major version. Use "x-init" instead.'
            ),
            (this.pauseReactivity = !0),
            i(this.$el.getAttribute("x-created"), this.$data),
            (this.pauseReactivity = !1)),
          this.initializeElements(this.$el),
          this.listenForNewElementsToInitialize(),
          "function" == typeof c && c.call(this.$data),
          o &&
            (console.warn(
              'AlpineJS Warning: "x-mounted" is deprecated and will be removed in the next major version. Use "x-init" (with a callback return) for the same behavior.'
            ),
            i(o, this.$data));
      }
      wrapDataInObservable(e) {
        var t = this;
        const n = {
          set(e, n, i) {
            const s = Reflect.set(e, n, i);
            var r, a, o;
            if (!t.pauseReactivity)
              return (
                ((r = () => {
                  for (t.updateElements(t.$el); t.nextTickStack.length > 0; )
                    t.nextTickStack.shift()();
                }),
                (a = 0),
                function () {
                  var e = this,
                    t = arguments,
                    n = function () {
                      (o = null), r.apply(e, t);
                    };
                  clearTimeout(o), (o = setTimeout(n, a));
                })(),
                s
              );
          },
          get: (e, t) =>
            e[t] && e[t].isRefsProxy
              ? e[t]
              : e[t] && e[t] instanceof Node
              ? e[t]
              : "object" == typeof e[t] && null !== e[t]
              ? new Proxy(e[t], n)
              : e[t],
        };
        return new Proxy(e, n);
      }
      walkAndSkipNestedComponents(e, t, n = () => {}) {
        !(function e(t, n) {
          if (!1 === n(t)) return;
          let i = t.firstElementChild;
          for (; i; ) e(i, n), (i = i.nextElementSibling);
        })(e, (e) =>
          e.hasAttribute("x-data") && !e.isSameNode(this.$el)
            ? (e.__x || n(e), !1)
            : t(e)
        );
      }
      initializeElements(e, t = () => {}) {
        for (
          this.walkAndSkipNestedComponents(
            e,
            (e) => {
              if (void 0 !== e.__x_for_key) return !1;
              this.initializeElement(e, t);
            },
            (e) => {
              e.__x = new x(e);
            }
          );
          this.nextTickStack.length > 0;
  
        )
          this.nextTickStack.shift()();
      }
      initializeElement(e, t) {
        e.hasAttribute("class") &&
          r(e).length > 0 &&
          (e.__x_original_classes = e.getAttribute("class").split(" ")),
          this.registerListeners(e, t),
          this.resolveBoundAttributes(e, !0, t);
      }
      updateElements(e, t = () => {}) {
        this.walkAndSkipNestedComponents(
          e,
          (e) => {
            if (void 0 !== e.__x_for_key && !e.isSameNode(this.$el)) return !1;
            this.updateElement(e, t);
          },
          (e) => {
            e.__x = new x(e);
          }
        );
      }
      updateElement(e, t) {
        this.resolveBoundAttributes(e, !1, t);
      }
      registerListeners(e, t) {
        r(e).forEach(({ type: n, value: i, modifiers: s, expression: r }) => {
          switch (n) {
            case "on":
              f(this, e, i, s, r, t);
              break;
            case "model":
              h(this, e, s, r, t);
          }
        });
      }
      resolveBoundAttributes(e, t = !1, n) {
        r(e).forEach(({ type: i, value: s, modifiers: r, expression: a }) => {
          switch (i) {
            case "model":
              d(this, e, "value", a, n);
              break;
            case "bind":
              if ("template" === e.tagName.toLowerCase() && "key" === s) return;
              d(this, e, s, a, n);
              break;
            case "text":
              void 0 === (c = this.evaluateReturnExpression(e, a, n)) &&
                a.match(/\./).length &&
                (c = ""),
                (e.innerText = c);
              break;
            case "html":
              e.innerHTML = this.evaluateReturnExpression(e, a, n);
              break;
            case "show":
              var c = this.evaluateReturnExpression(e, a, n);
              !(function (e, t, n = !1) {
                t
                  ? o(
                      e,
                      () => {
                        1 === e.style.length && "" !== e.style.display
                          ? e.removeAttribute("style")
                          : e.style.removeProperty("display");
                      },
                      n
                    )
                  : l(
                      e,
                      () => {
                        e.style.display = "none";
                      },
                      n
                    );
              })(e, c, t);
              break;
            case "if":
              c = this.evaluateReturnExpression(e, a, n);
              !(function (e, t, n) {
                "template" !== e.nodeName.toLowerCase() &&
                  console.warn(
                    "Alpine: [x-if] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#x-if"
                  );
                const i =
                  e.nextElementSibling &&
                  !0 === e.nextElementSibling.__x_inserted_me;
                if (t && !i) {
                  const t = document.importNode(e.content, !0);
                  e.parentElement.insertBefore(t, e.nextElementSibling),
                    (e.nextElementSibling.__x_inserted_me = !0),
                    o(e.nextElementSibling, () => {}, n);
                } else
                  !t &&
                    i &&
                    l(
                      e.nextElementSibling,
                      () => {
                        e.nextElementSibling.remove();
                      },
                      n
                    );
              })(e, c, t);
              break;
            case "for":
              u(this, e, a, t);
              break;
            case "cloak":
              e.removeAttribute("x-cloak");
          }
        });
      }
      evaluateReturnExpression(e, t, i = () => {}) {
        return n(t, this.$data, {
          ...i(),
          $dispatch: this.getDispatchFunction(e),
        });
      }
      evaluateCommandExpression(e, t, n = () => {}) {
        i(t, this.$data, { ...n(), $dispatch: this.getDispatchFunction(e) });
      }
      getDispatchFunction(e) {
        return (t, n = {}) => {
          e.dispatchEvent(new CustomEvent(t, { detail: n, bubbles: !0 }));
        };
      }
      listenForNewElementsToInitialize() {
        const e = this.$el;
        new MutationObserver((e) => {
          for (let t = 0; t < e.length; t++) {
            const i = e[t].target.closest("[x-data]");
            if (!i || !i.isSameNode(this.$el)) return;
            if ("attributes" === e[t].type && "x-data" === e[t].attributeName) {
              const i = n(e[t].target.getAttribute("x-data"), {});
              Object.keys(i).forEach((e) => {
                this.$data[e] !== i[e] && (this.$data[e] = i[e]);
              });
            }
            e[t].addedNodes.length > 0 &&
              e[t].addedNodes.forEach((e) => {
                1 === e.nodeType &&
                  (e.matches("[x-data]")
                    ? (e.__x = new x(e))
                    : this.initializeElements(e));
              });
          }
        }).observe(e, { childList: !0, attributes: !0, subtree: !0 });
      }
      getRefsProxy() {
        var e = this;
        return new Proxy(
          {},
          {
            get(t, n) {
              return (
                "isRefsProxy" === n ||
                (e.walkAndSkipNestedComponents(e.$el, (e) => {
                  e.hasAttribute("x-ref") &&
                    e.getAttribute("x-ref") === n &&
                    (i = e);
                }),
                i)
              );
              var i;
            },
          }
        );
      }
    }
    const v = {
      start: async function () {
        t() ||
          (await new Promise((e) => {
            "loading" == document.readyState
              ? document.addEventListener("DOMContentLoaded", e)
              : e();
          })),
          this.discoverComponents((e) => {
            this.initializeComponent(e);
          }),
          document.addEventListener("turbolinks:load", () => {
            this.discoverUninitializedComponents((e) => {
              this.initializeComponent(e);
            });
          }),
          this.listenForNewUninitializedComponentsAtRunTime((e) => {
            this.initializeComponent(e);
          });
      },
      discoverComponents: function (e) {
        document.querySelectorAll("[x-data]").forEach((t) => {
          e(t);
        });
      },
      discoverUninitializedComponents: function (e, t = null) {
        const n = (t || document).querySelectorAll("[x-data]");
        Array.from(n)
          .filter((e) => void 0 === e.__x)
          .forEach((t) => {
            e(t);
          });
      },
      listenForNewUninitializedComponentsAtRunTime: function (e) {
        const t = document.querySelector("body");
        new MutationObserver((e) => {
          for (let t = 0; t < e.length; t++)
            e[t].addedNodes.length > 0 &&
              e[t].addedNodes.forEach((e) => {
                1 === e.nodeType &&
                  (e.parentElement.closest("[x-data]") ||
                    this.discoverUninitializedComponents((e) => {
                      this.initializeComponent(e);
                    }, e.parentElement));
              });
        }).observe(t, { childList: !0, attributes: !0, subtree: !0 });
      },
      initializeComponent: function (e) {
        e.__x = new x(e);
      },
    };
    return t() || ((window.Alpine = v), window.Alpine.start()), v;
  });
  //# sourceMappingURL=alpine.js.map
  
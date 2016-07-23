import { $ } from 'meteor/jquery';

let promise = null;
let onReady = null;

/**
 * Call "done" as soon as MathJax is ready
 * to start rendering.
 */
function whenMathJaxIsReady (done) {
  const MathJax = window.MathJax;
  if (MathJax && MathJax.Hub && MathJax.Hub.queue) {
    done();
  } else if (MathJax &&
             MathJax.Hub &&
             MathJax.Hub.Register &&
      typeof MathJax.Hub.Register.StartupHook === 'function') {
    // NOTE: Make sure further tasks are scheduled after MathJax is fully configured and operational.
    MathJax.Hub.Register.StartupHook("Begin", done);
  } else {
    throw new Error('It looks like MathJax is not loaded yet.');
  }
};

/**
 * Create the MathJax promise singleton.
 */
function getMathJaxPromise (sourceUrl, defaultConfig={}) {
  if (promise) return promise;
  promise = new Promise(function (resolve) {
    if (!window.MathJax && sourceUrl) {
      window.MathJax = {
        AuthorInit: function () {
          window.MathJax.Hub.Config(defaultConfig);
          whenMathJaxIsReady(resolve);
        }
      };
      // load the MathJax script
      $.getScript(sourceUrl);
    } else {
      onReady = () => whenMathJaxIsReady(resolve);
    }
  });
  return promise;
}

export const ReactMathJax = {

  sourceUrl : 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',

  /**
   * Explicitly tell that MathJax has been loaded
   * and configured. Useful for manual configuration.
   */
  ready () {
    if (onReady) return onReady();
    onReady = null;
  },

  /**
   * Call the given callback as soon as MathJax is loaded.
   * @param {Function} callback
   */
  require (callback) {
    getMathJaxPromise(
      this.sourceUrl,
      this.defaultConfig).then(function () {

      callback(window.MathJax);
    });
  },
  /**
   * Default configuration which will be used as soon as MathJax is loaded.
   * It can be overwritten by the user.
   */
  defaultConfig: {
    skipStartupTypeset: true,
    showProcessingMessages: false,
    tex2jax: {
      inlineMath: [['$','$'],['\\(','\\)']]
    }
  }
};

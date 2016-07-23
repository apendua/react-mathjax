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
    done(null, MathJax);
  } else if (MathJax &&
             MathJax.Hub &&
             MathJax.Hub.Register &&
      typeof MathJax.Hub.Register.StartupHook === 'function') {
    // NOTE: Make sure further tasks are scheduled after MathJax is fully configured and operational.
    MathJax.Hub.Register.StartupHook("Begin", () => done(null, MathJax));
  } else {
    done(new Error('It looks like MathJax is not loaded yet.'));
  }
};

/**
 * Create the MathJax promise singleton.
 */
function getMathJaxPromise (sourceUrl, defaultConfig={}) {
  if (promise) return promise;
  promise = new Promise(function (resolve, reject) {
    const done = (err, MathJax) => err ? reject(err) : resolve(MathJax);
    if (!window.MathJax && sourceUrl) {
      window.MathJax = {
        AuthorInit: function () {
          window.MathJax.Hub.Config(defaultConfig);
          whenMathJaxIsReady(done);
        }
      };
      // load the MathJax script
      $.getScript(sourceUrl);
    } else {
      // let's wait until the user call "ready" manually
      onReady = () => whenMathJaxIsReady(done);
    }
  });
  return promise;
}

export const MathJaxPromise = {
  sourceUrl: 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',

  /**
   * Default configuration which will be used as soon
   * as MathJax is loaded. It can be overwritten by the user.
   */
  defaultConfig: {
    skipStartupTypeset: true,
    showProcessingMessages: false,
    tex2jax: {
      inlineMath: [['$','$'],['\\(','\\)']]
    }
  },

  /**
   * Explicitly tell that MathJax has been loaded
   * and configured. Useful for manual configuration.
   */
  ready (MathJax) {
    if (onReady) {
      onReady();
      onReady = null;
    } else if (!promise) {
      promise = Promise.resolve(MathJax);
    }
  },

  /**
   * Call the given callback as soon as MathJax is loaded.
   * @param {Function} callback
   */
  then (onSuccess, onFailure) {
    return getMathJaxPromise(
      this.sourceUrl,
      this.defaultConfig
    )
    .then(onSuccess, onFailure);
  },
};

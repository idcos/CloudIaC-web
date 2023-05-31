import CodeMirror from 'codemirror';
import './style.css';

CodeMirror.defineMode('error-message', function () {
  return {
    token: function (stream) {
      stream.next();
      return 'error-text';
    },
  };
});

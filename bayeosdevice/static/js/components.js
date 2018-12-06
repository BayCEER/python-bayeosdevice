'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Text = function (_React$Component) {
  _inherits(Text, _React$Component);

  function Text() {
    _classCallCheck(this, Text);

    return _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).apply(this, arguments));
  }

  _createClass(Text, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        this.props.item_value
      );
    }
  }]);

  return Text;
}(React.Component);

var TextInput = function (_React$Component2) {
  _inherits(TextInput, _React$Component2);

  function TextInput(props) {
    _classCallCheck(this, TextInput);

    var _this2 = _possibleConstructorReturn(this, (TextInput.__proto__ || Object.getPrototypeOf(TextInput)).call(this, props));

    _this2.state = {
      item_value: null
    };
    _this2.keyPress = _this2.keyPress.bind(_this2);
    _this2.handleChange = _this2.handleChange.bind(_this2);
    _this2.onBlur = _this2.onBlur.bind(_this2);
    return _this2;
  }

  _createClass(TextInput, [{
    key: 'keyPress',
    value: function keyPress(e) {
      if (e.key == 'Enter') {
        this.props.onChange(this.props.item_key, e.target.value);
        e.target.blur();
      }
    }
  }, {
    key: 'onBlur',
    value: function onBlur(e) {
      this.setState({ item_value: null });
    }
  }, {
    key: 'handleChange',
    value: function handleChange(e) {
      this.setState({
        item_value: e.target.value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var value = this.state.item_value != null ? this.state.item_value : this.props.item_value;
      return React.createElement(
        'div',
        null,
        React.createElement('input', { type: 'text', onChange: this.handleChange, onKeyPress: this.keyPress, onBlur: this.onBlur, value: value, className: 'form-control' })
      );
    }
  }]);

  return TextInput;
}(React.Component);

var NumberInput = function (_React$Component3) {
  _inherits(NumberInput, _React$Component3);

  function NumberInput(props) {
    _classCallCheck(this, NumberInput);

    var _this3 = _possibleConstructorReturn(this, (NumberInput.__proto__ || Object.getPrototypeOf(NumberInput)).call(this, props));

    _this3.state = {
      min: props.prop.min,
      max: props.prop.max,
      step: props.prop.step ? props.prop.step : 1,
      item_value: null
    };
    _this3.keyPress = _this3.keyPress.bind(_this3);
    _this3.onChange = _this3.onChange.bind(_this3);
    _this3.onBlur = _this3.onBlur.bind(_this3);
    return _this3;
  }

  _createClass(NumberInput, [{
    key: 'keyPress',
    value: function keyPress(e) {
      // console.log("keyPress:" + e.target.value);
      if (e.key == 'Enter' && !isNaN(e.target.value)) {
        this.props.onChange(this.props.item_key, parseFloat(e.target.value));
        e.target.blur();
      }
    }
  }, {
    key: 'onBlur',
    value: function onBlur(e) {
      this.setState({ item_value: null });
    }
  }, {
    key: 'onChange',
    value: function onChange(e) {
      // console.log("onChange");
      this.setState({ item_value: e.target.value });
    }
  }, {
    key: 'render',
    value: function render() {
      // console.log("render");
      var value = this.state.item_value != null ? this.state.item_value : this.props.item_value;
      var error = isNaN(parseFloat(value));
      var message = error ? 'Please insert a valid number.' : '';
      var className = error ? 'has-error' : '';
      return React.createElement(
        'div',
        { className: className },
        React.createElement('input', { type: 'number', min: this.state.min, max: this.state.max, step: this.state.step,
          onChange: this.onChange, onKeyPress: this.keyPress, onBlur: this.onBlur, value: value, className: 'form-control' }),
        React.createElement(Message, { message: message, error: error })
      );
    }
  }]);

  return NumberInput;
}(React.Component);

var Message = function (_React$Component4) {
  _inherits(Message, _React$Component4);

  function Message() {
    _classCallCheck(this, Message);

    return _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).apply(this, arguments));
  }

  _createClass(Message, [{
    key: 'render',
    value: function render() {
      if (!this.props.error) {
        return null;
      } else {
        return React.createElement(
          'span',
          { 'class': 'help-block' },
          this.props.message
        );
      }
    }
  }]);

  return Message;
}(React.Component);

var Slider = function (_React$Component5) {
  _inherits(Slider, _React$Component5);

  function Slider(props) {
    _classCallCheck(this, Slider);

    var _this5 = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, props));

    _this5.handleChange = _this5.handleChange.bind(_this5);
    _this5.state = {
      min: props.prop.min,
      max: props.prop.max,
      step: props.prop.step
    };
    return _this5;
  }

  _createClass(Slider, [{
    key: 'handleChange',
    value: function handleChange(e) {
      this.props.onChange(this.props.item_key, e.target.value);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement('input', { type: 'range', onChange: this.handleChange, min: this.state.min, max: this.state.max, step: this.state.step, value: this.props.item_value, className: 'form-control' }),
        React.createElement(
          'div',
          { className: 'pull-left' },
          this.state.min
        ),
        React.createElement(
          'div',
          { className: 'pull-right' },
          this.state.max
        )
      );
    }
  }]);

  return Slider;
}(React.Component);

var Select = function (_React$Component6) {
  _inherits(Select, _React$Component6);

  function Select(props) {
    _classCallCheck(this, Select);

    var _this6 = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

    _this6.handleChange = _this6.handleChange.bind(_this6);
    var ops = _this6.props.prop.map(function (value) {
      return React.createElement(
        'option',
        { value: value, key: value },
        value
      );
    });
    _this6.state = {
      options: ops
    };
    return _this6;
  }

  _createClass(Select, [{
    key: 'handleChange',
    value: function handleChange(e) {
      this.props.onChange(this.props.item_key, e.target.value);
      e.target.blur();
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'select',
          { onChange: this.handleChange, value: this.props.item_value, className: 'form-control' },
          this.state.options
        )
      );
    }
  }]);

  return Select;
}(React.Component);

var Toggle = function (_React$Component7) {
  _inherits(Toggle, _React$Component7);

  function Toggle(props) {
    _classCallCheck(this, Toggle);

    var _this7 = _possibleConstructorReturn(this, (Toggle.__proto__ || Object.getPrototypeOf(Toggle)).call(this, props));

    _this7.state = {
      text_on: props.prop.text_on ? props.prop.text_on : "On",
      text_off: props.prop.text_off ? props.prop.text_off : "Off",
      width: props.prop.width ? props.prop.width : 58,
      height: props.prop.height ? props.prop.height : 34
    };
    _this7.handleChange = _this7.handleChange.bind(_this7);
    return _this7;
  }

  _createClass(Toggle, [{
    key: 'handleChange',
    value: function handleChange(e) {
      this.props.onChange(this.props.item_key, !this.props.item_value);
      e.target.blur();
    }
  }, {
    key: 'render',
    value: function render() {
      var className = "toggle btn btn-" + (this.props.item_value ? "primary on" : "default off");
      var style = { 'width': this.state.width + 'px', 'height': this.state.height + 'px' };
      return React.createElement(
        'div',
        { className: className, style: style },
        React.createElement(
          'div',
          { className: 'toggle-group', onClick: this.handleChange },
          React.createElement(
            'label',
            { className: 'btn btn-primary toggle-on' },
            this.state.text_on
          ),
          React.createElement(
            'label',
            { className: 'btn btn-default toggle-off' },
            this.state.text_off
          ),
          React.createElement('span', { className: 'toggle-handle btn btn-default' })
        )
      );
    }
  }]);

  return Toggle;
}(React.Component);

var CheckBox = function (_React$Component8) {
  _inherits(CheckBox, _React$Component8);

  function CheckBox(props) {
    _classCallCheck(this, CheckBox);

    var _this8 = _possibleConstructorReturn(this, (CheckBox.__proto__ || Object.getPrototypeOf(CheckBox)).call(this, props));

    _this8.handleChange = _this8.handleChange.bind(_this8);
    return _this8;
  }

  _createClass(CheckBox, [{
    key: 'handleChange',
    value: function handleChange(event) {
      this.props.onChange(this.props.item_key, !this.props.item_value);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement('input', { type: 'checkbox', onChange: this.handleChange, value: this.props.item_value, checked: this.props.item_value })
      );
    }
  }]);

  return CheckBox;
}(React.Component);
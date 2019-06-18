import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import MediaObserver, { breakpoints } from '../_utils/MediaObserver';

export const RowContext = React.createContext();

class Row extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    align: PropTypes.oneOf(['start', 'center', 'end']),
    justify: PropTypes.oneOf([
      'start',
      'center',
      'end',
      'space-around',
      'space-between'
    ]),
    gutter: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        xs: PropTypes.number,
        sm: PropTypes.number,
        md: PropTypes.number,
        lg: PropTypes.number,
        xl: PropTypes.number,
        xxl: PropTypes.number
      })
    ]),
    prefixClass: PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    prefixClass: 'mp',
    gutter: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      screens: {}
    };
  }

  componentDidMount() {
    this.unsubscribeMediaObserver = MediaObserver.subscribe(screens => {
      if (typeof this.props.gutter === 'object') {
        this.setState({
          screens
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeMediaObserver();
  }

  getGutter() {
    const { gutter: propsGutter } = this.props;
    const { screens } = this.state;
    if (typeof propsGutter === 'object') {
      for (let i = 0; i < breakpoints.length; i++) {
        const breakpoint = breakpoints[i];
        if (screens[breakpoint] && +propsGutter[breakpoint] > 0) {
          return +propsGutter[breakpoint];
        }
      }
    }
    return +propsGutter || 0;
  }

  render() {
    const {
      prefixClass,
      children,
      align,
      justify,
      className,
      gutter,
      style,
      ...rest
    } = this.props;
    const classPrefix = `${prefixClass}-row`;
    const classNames = classnames(classPrefix, className, {
      [`${prefixClass}-row-justify-${justify}`]: !!justify,
      [`${prefixClass}-row-align-${align}`]: !!align
    });
    const gutterWidth = this.getGutter();
    const rowStyle =
      gutterWidth > 0
        ? {
            marginLeft: `${-gutterWidth / 2}px`,
            marginRight: `${-gutterWidth / 2}px`,
            ...style
          }
        : style;
    return (
      <RowContext.Provider value={{ gutter }}>
        <div {...rest} className={classNames} style={rowStyle}>
          {children}
        </div>
      </RowContext.Provider>
    );
  }
}

export default Row;

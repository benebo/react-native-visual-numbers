import React, { Component } from 'react';
import { View } from 'react-native';

class HalfPercentageCircle extends Component {
  propTypes: {
    radius: React.PropTypes.number,
    percent: React.PropTypes.number,
    color: React.PropTypes.string,
    secondaryColor: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    borderWidth: React.Proptypes.number,
    innerBorderWidth: React.Proptypes.number,
    textStyle: React.Proptypes.array,
  }


  constructor(props) {
    super(props);
    const { percent } = this.props;
    const percentValue = calculatevalidPercentValue(percent);
    const transformerDegree = calculateTransformerDegree(percent);

    const borderWidth = this.props.borderWidth || 5;
    const rightCircleBorderWidth = this.props.rightCircleBorderWidth || borderWidth;

    const color = this.props.color || '#f29400';
    const secondaryColor = this.props.secondaryColor || 'gray';
    const backgroundColor = this.props.backgroundColor || 'white';

    this.state = {
      percent: percentValue,
      transformerDegree,
      borderWidth,
      rightCircleBorderWidth,
      color,
      secondaryColor,
      backgroundColor,
    };
  }

  render() {
    const {
      percent,
      transformerDegree,
      borderWidth,
      rightCircleBorderWidth,
      color,
      secondaryColor,
      backgroundColor,
    } = this.state;
    const { radius } = this.props;
    return (
      <View
        style={[{
            backgroundColor,
            width: radius * 2,
            height: radius
          }]}
        // render offscreen so that opacity changes only for the whole component
        // and not for each child of its children
        needsOffscreenAlphaCompositing
        renderToHardwareTextureAndroid
      >
        {/** the background in the whole container*/}
        <View
          style={[{
            width: radius * 2,
            height: radius * 2,
            position: 'absolute',
            backgroundColor
          }]}
        >

        {/** the circle with the secondary color. it has a
          *  variable visible borderwidth. its outer boundaries are determined
          *  by taking the radius. from there we go to the middle of the borderwidth
          *  (= borderWidth / ) and then back by half the borderwidth this circle
          *  shall have (rightCircleBorderWidth).
          */}
         <View
           style={{
             borderRadius: (radius - (borderWidth / 2) + (rightCircleBorderWidth / 2)),
             height: (radius - (borderWidth / 2) + (rightCircleBorderWidth / 2)) * 2,
             width: (radius - (borderWidth / 2) + (rightCircleBorderWidth / 2)) * 2,
             position: 'absolute',
             backgroundColor: secondaryColor,
             top: ((borderWidth / 2) - (rightCircleBorderWidth / 2)),
             left: ((borderWidth / 2) - (rightCircleBorderWidth / 2)),
             bottom: ((borderWidth / 2) - (rightCircleBorderWidth / 2)),
             right: ((borderWidth / 2) - (rightCircleBorderWidth / 2))
            }}
         />
         {/**
           * the circle to cover spaces in the inner circle so that the
           * 'rightCircleBorderWidth' is spaced equal ob both sides.
           *
           */}
         <View
           style={{
             borderRadius: (radius - (borderWidth / 2) - (rightCircleBorderWidth / 2)),
             height: (radius - (borderWidth / 2) - (rightCircleBorderWidth / 2)) * 2,
             width: (radius - (borderWidth / 2) - (rightCircleBorderWidth / 2)) * 2,
             position: 'absolute',
             backgroundColor,
             top: (borderWidth / 2) + (rightCircleBorderWidth / 2),
             left: (borderWidth / 2) + (rightCircleBorderWidth / 2),
             bottom: (borderWidth / 2) + (rightCircleBorderWidth / 2),
             right: (borderWidth / 2) + (rightCircleBorderWidth / 2)
            }}

         />
         {/** the main percantage circle: composed by a half circle on the left of the container
           *  that is then transformed.
           */}
         <View
           style={{
             borderBottomLeftRadius: radius,
             borderTopLeftRadius: radius,
             height: radius * 2,
             width: radius,
             position: 'absolute',
             backgroundColor: color,
            }}
           transform={[
             { translateX: radius / 2 },
             { rotate: `${transformerDegree} deg` },
             { translateX: -radius / 2 },
           ]}
         />
         {/** the inner circle whose color is determined by the backgroundColor prop
           *  it is used to cover minor differences between the actual and
           *  calculated value (round down) and to cover the other colored circles.
           */}
          <View
            style={{
              borderRadius: radius,
              height: (radius - borderWidth) * 2,
              width: (radius - borderWidth) * 2,
              position: 'absolute',
              backgroundColor,
              top: borderWidth,
              left: borderWidth
             }}
          />
        </View>
      </View>
    );
  }
}

const calculatevalidPercentValue = (percent) => {
  const percentValue = parseInt(percent, 10);
  if (percentValue > 100) {
    return 100;
  } else if (percentValue < 0) {
    return 0;
  }
  return percentValue;
};

const calculateTransformerDegree = (percent) => {
  return percent < 50 ? -(50 - percent) * 1.8 : (percent - 50) * 1.8;
};

export { HalfPercentageCircle };

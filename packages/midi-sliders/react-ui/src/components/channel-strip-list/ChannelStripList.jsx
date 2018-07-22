import React from 'react'
import Typography from '@material-ui/core/Typography'
import ChannelStrip from './channel-strip/ChannelStrip'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ViewSettingsActions from '../../actions/view-settings'
import { withStyles } from '@material-ui/core/styles'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

class ChannelStripList extends React.Component {
  state = {
    sliderList: []
  }
  constructor (props) {
    super(props)
    this.state = {
      sliderList: props.sliderList
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.sliderList !== this.props.sliderList) {
      this.setState({
        sliderList: nextProps.sliderList
      })
    }
  }
  render () {
    if (this.props.sliderList.length > 0) {
      if (this.props.viewSettings.isLayoutMode) {
        return (
          <DragDropContext
            onDragEnd={this.onDragEnd}
            id='channelList-layoutMode'
            className={this.props.classes.channelList}
          >
            <Droppable droppableId='droppable' direction='horizontal'>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={this.getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >

                  {this.renderChannelStrips()}
                </div>
              )}
            </Droppable>
          </DragDropContext>

        )
      } else {
        return (
          <div>
            <div id='channelList' className={this.props.classes.channelList}>
              {this.renderChannelStrips()}
            </div>
          </div>
        )
      }
    } else {
      return (
        <Typography variant='display1' className={this.props.classes.noMidiTypography}>
          <br />
          <br />
          Please add a slider!
          <br />
          <br />
          You can do this with the button at the right top in the AppBar → ↑
        </Typography>
      )
    }
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {

    }

    const sliderList = this.reorder(
      this.state.sliderList,
      result.source.index,
      result.destination.index
    )
    this.setState({
      sliderList
    })
    this.props.actions.updateListOrder(sliderList)
  }

  renderChannelStrips = () => {
    const entries = this.state.sliderList
    return entries && entries.map((sliderEntry, idx) => {
      const data = { sliderEntry, idx }

      if (this.props.viewSettings.isLayoutMode) {
        return (
          <Draggable
            key={`slider-${idx}`}
            draggableId={`slider-${idx}`}
            index={idx}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={this.getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}
              >

                <div
                  style={{ pointerEvents: 'none', backgroundColor: 'rgba(0,255,0,0.3)' }}
                >
                  <ChannelStrip
                    {...data}
                  />
                </div>
              </div>
            )}
          </Draggable>
        )
      } else {
        return (
          <ChannelStrip
            key={`slider-${idx}`}
            {...data}
          />
        )
      }
    })
  }

  getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    padding: 8,
    overflow: 'auto'
  })

  // a little function to help us with reordering the result
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 8 * 2,
    margin: `0 ${8}px 0 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
  })
}

const styles = theme => ({
  channelList: {
    display: 'flex',
    overflowX: 'scroll'
  }
})

function mapStateToProps (state) {
  return {
    sliderList: state.sliderList,
    viewSettings: state.viewSettings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(ViewSettingsActions, dispatch)
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChannelStripList)))

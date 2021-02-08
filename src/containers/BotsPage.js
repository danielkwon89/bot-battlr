import React, { Component } from "react";
import BotCollection from './BotCollection';
import YourBotArmy from './YourBotArmy';

class BotsPage extends Component {

  state = {
    botsCollection: [],
    botArmyCollection: []
  }

  componentDidMount() {
    // fetching all bots and adding them to the botsCollection array in state

    fetch("http://localhost:6001/bots")
    .then(res => res.json())
    .then(data => {
      return(
        data.map((bot, index) => {
          this.setState({
            botsCollection: [...this.state.botsCollection, bot],
            botArmyCollection: [...this.state.botArmyCollection]
          })
        })
      )
    })
  }

  addBotToArmy = (event) => {

    // checks YourBotArmy for the clicked bot
    const botNotFound = !this.state.botArmyCollection.find(e => e.id === parseInt(event.currentTarget.id))
    // grabs the clicked bot from BotCollection
    const botArmyAddition = this.state.botsCollection.find(e => e.id === parseInt(event.currentTarget.id))

    if (botNotFound) {
      this.setState({
        botsCollection: [...this.state.botsCollection],
        botArmyCollection: [...this.state.botArmyCollection, botArmyAddition]
      })
    }
  }

  removeBotFromArmy = (event) => {
    
    // callback for use in .findIndex; returns the element that matches the condition
    const botIdsMatch = (element) => {
      return element.id === parseInt(event.currentTarget.id)
    }

    // finds the index of the element returned from the callback
    const botIndex = this.state.botArmyCollection.findIndex(botIdsMatch)

    if (botIndex != -1) {
      this.setState({
        botsCollection: [...this.state.botsCollection],
        botArmyCollection: [...this.state.botArmyCollection.slice(0, botIndex), ...this.state.botArmyCollection.slice(botIndex + 1)]
      })
    }
  }

  removeBotFromBotsCollection = (event) => {

    const botIdsMatch = (element) => {
      return element.id === parseInt(event.currentTarget.id)
    }

    const botIndex = this.state.botArmyCollection.findIndex(botIdsMatch)

    if (botIndex != -1) {
      this.setState({
        botsCollection: [...this.state.botsCollection.slice(0, botIndex), ...this.state.botsCollection.slice(botIndex + 1)],
        botArmyCollection: [...this.state.botArmyCollection]
      })
    }
  }

  removeBotFromAll = (event) => {
    // FIX THIS
    // need to then send a DELETE request to backend to remove bot by id

    // prevents removeBotFromArmy(), which is listening on a grandparent div, from firing when the nested event listener on the red "x" button is clicked
    event.stopPropagation()
    this.removeBotFromArmy(event)
    this.removeBotFromBotsCollection(event)

    fetch(`http://localhost:6001/bots/${event.currentTarget.id}`, 
    { 
      method: 'DELETE', 
      headers: { 'Content-Type': 'application/json' },
      body: null
    })

    // fetch("http://localhost:6001/bots")
    // .then(res => res.json())
    // .then(data => {
    //   return(
    //     data.map((bot, index) => {
    //       this.setState({
    //         botsCollection: [...this.state.botsCollection, bot],
    //         botArmyCollection: [...this.state.botArmyCollection]
    //       })
    //     })
    //   )
    // })
  }

  render() {
    return(
      <div>
        <BotCollection 
          botsCollection={this.state.botsCollection} 
          addBotToArmy={this.addBotToArmy.bind(this)} 
          removeBotFromAll={this.removeBotFromAll.bind(this)} 
        />

        <YourBotArmy 
          botArmyCollection={this.state.botArmyCollection} 
          removeBotFromArmy={this.removeBotFromArmy.bind(this)} 
          removeBotFromAll={this.removeBotFromAll.bind(this)} 
        />
      </div>
    )
  }
}

export default BotsPage;

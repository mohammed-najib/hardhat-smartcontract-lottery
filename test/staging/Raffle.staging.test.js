const { expect, assert } = require("chai")
const { network, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", function () {
              it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
                  // Enter the raffle
                  const startingTimeStamp = await raffle.getLatestTimeStamp()
                  const accounts = await ethers.getSigners()

                  await new Promise(async (resolve, reject) => {
                      // setup listener before we enter the raffle
                      // just in case the blockchain moves really fast
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")
                          try {
                              const recentWinner =
                                  await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance =
                                  await accounts[0].getBalance()
                              const endingTimeStamp =
                                  await raffle.getLatestTimeStamp()

                              console.log("--------------")
                              console.log(
                                  recentWinner,
                                  raffleState,
                                  winnerEndingBalance.toString(),
                                  endingTimeStamp.toString()
                              )
                              console.log("--------------")

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(
                                  recentWinner.toString(),
                                  accounts[0].address
                              )
                              assert.equal(raffleState, 0)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance
                                      .add(raffleEntranceFee)
                                      .toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(error)
                          }
                      })

                      // Then entering the raffle
                      //   await raffle.enterRaffle({ value: raffleEntranceFee })
                      //   const winnerStartingBalance =
                      //       await accounts[0].getBalance()
                      console.log("Entering Raffle...")
                      const tx = await raffle.enterRaffle({
                          value: raffleEntranceFee,
                      })
                      await tx.wait(1)
                      console.log("ok, time to wait...")
                      const winnerStartingBalance =
                          await accounts[0].getBalance()

                      console.log("*************")
                      console.log(winnerStartingBalance.toString()),
                          console.log("*************")
                  })
              })
          })
      })

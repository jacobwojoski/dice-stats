#!/bin/bash
echo "Rebuilding Doc"
cd  ~/Desktop/Development/GIT/dice-stats
yarn build

echo ""

echo "Updating Foundry"
sleep 2
cd  ~/Desktop/FoundryDev/Data/modules
echo "Removing Current Dice Stats"
rm -rf ./dice-stats
sleep 1
echo "Adding New Dice Stats Dist"
ln -sfn ~/Desktop/Development/GIT/dice-stats/dist/ dice-stats
sleep 1

echo "Done"

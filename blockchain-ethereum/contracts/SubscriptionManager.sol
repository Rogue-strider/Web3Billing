// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SubscriptionManager {
    struct Subscription {
        address user;
        address merchant;
        uint256 planId;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }

    uint256 public subscriptionCounter;
    mapping(uint256 => Subscription) public subscriptions;

    event Subscribed(
        uint256 indexed subscriptionId,
        address indexed user,
        address indexed merchant,
        uint256 planId,
        uint256 startTime,
        uint256 endTime
    );

    event SubscriptionCancelled(
        uint256 indexed subscriptionId,
        address indexed user
    );

    function subscribe(
        address merchant,
        uint256 planId,
        uint256 duration
    ) external payable {
        require(msg.value > 0, "Payment required");
        require(merchant != address(0), "Invalid merchant");

        subscriptionCounter++;

        subscriptions[subscriptionCounter] = Subscription({
            user: msg.sender,
            merchant: merchant,
            planId: planId,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            active: true
        });

        (bool success, ) = merchant.call{value: msg.value}("");
        require(success, "Payment failed");

        emit Subscribed(
            subscriptionCounter,
            msg.sender,
            merchant,
            planId,
            block.timestamp,
            block.timestamp + duration
        );
    }

    function cancel(uint256 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];

        require(sub.user == msg.sender, "Not subscription owner");
        require(sub.active, "Already inactive");

        sub.active = false;

        emit SubscriptionCancelled(subscriptionId, msg.sender);
    }

    function isActive(uint256 subscriptionId) external view returns (bool) {
        Subscription memory sub = subscriptions[subscriptionId];
        return sub.active && block.timestamp <= sub.endTime;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SubscriptionManager is ReentrancyGuard {

    /* =============================
        STRUCTS
    ============================== */

    struct Subscription {
        address user;
        address merchant;
        uint256 planId;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }

    struct Plan {
        uint256 price;
        uint256 duration;
        bool active;
    }

    /* =============================
        STATE
    ============================== */

    address public owner;

    uint256 public subscriptionCounter;

    mapping(uint256 => Subscription) public subscriptions;

    mapping(uint256 => Plan) public plans;

    mapping(address => bool) public merchants;

    /* =============================
        MODIFIERS
    ============================== */

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    /* =============================
        CONSTRUCTOR
    ============================== */

    constructor() {
        owner = msg.sender;
    }

    /* =============================
        MERCHANT MANAGEMENT
    ============================== */

    function registerMerchant(address merchant) external onlyOwner {
        require(merchant != address(0), "Invalid merchant");
        merchants[merchant] = true;
    }

    function removeMerchant(address merchant) external onlyOwner {
        merchants[merchant] = false;
    }

    /* =============================
        PLAN MANAGEMENT
    ============================== */

    function createPlan(
        uint256 planId,
        uint256 price,
        uint256 duration
    ) external onlyOwner {

        require(price > 0, "Invalid price");
        require(duration > 0, "Invalid duration");

        plans[planId] = Plan({
            price: price,
            duration: duration,
            active: true
        });
    }

    function deactivatePlan(uint256 planId) external onlyOwner {
        plans[planId].active = false;
    }

    /* =============================
        EVENTS
    ============================== */

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

    /* =============================
        SUBSCRIBE
    ============================== */

    function subscribe(
        address merchant,
        uint256 planId
    ) external payable nonReentrant {

        require(merchants[merchant], "Merchant not registered");

        Plan memory plan = plans[planId];

        require(plan.active, "Plan not active");

        require(msg.value == plan.price, "Incorrect payment");

        subscriptionCounter++;

        uint256 start = block.timestamp;
        uint256 end = block.timestamp + plan.duration;

        subscriptions[subscriptionCounter] = Subscription({
            user: msg.sender,
            merchant: merchant,
            planId: planId,
            startTime: start,
            endTime: end,
            active: true
        });

        (bool success, ) = merchant.call{value: msg.value}("");
        require(success, "Payment failed");

        emit Subscribed(
            subscriptionCounter,
            msg.sender,
            merchant,
            planId,
            start,
            end
        );
    }

    /* =============================
        CANCEL
    ============================== */

    function cancel(uint256 subscriptionId) external {

        Subscription storage sub = subscriptions[subscriptionId];

        require(sub.user == msg.sender, "Not subscription owner");
        require(sub.active, "Already inactive");

        sub.active = false;

        emit SubscriptionCancelled(subscriptionId, msg.sender);
    }

    /* =============================
        ACTIVE CHECK
    ============================== */

    function isActive(uint256 subscriptionId) external view returns (bool) {

        Subscription memory sub = subscriptions[subscriptionId];

        return sub.active && block.timestamp <= sub.endTime;
    }
}
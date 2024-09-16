// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

contract ShipmentTracker is ERC20, AccessControl {
    bytes32 public constant SHIPPER_ROLE = keccak256("SHIPPER_ROLE");

    enum ShipmentStatus { Pending, InTransit, Delivered }

    struct Shipment {
        address sender;
        address receiver;
        ShipmentStatus status;
        uint256 amount;
    }

    mapping(uint256 => Shipment) public shipments;
    uint256 public shipmentCount;

    event ShipmentCreated(uint256 id, address indexed sender, address indexed receiver, ShipmentStatus status, uint256 amount);
    event ShipmentStatusUpdated(uint256 id, ShipmentStatus status);
    event ShipmentDelivered(uint256 id, ShipmentStatus status);

    constructor(address defaultAdmin)
        ERC20("TradeChain", "TDC")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }

    modifier onlyShipper() {
        require(hasRole(SHIPPER_ROLE, msg.sender), "Caller is not a shipper");
        _;
    }

    function createShipment(address _receiver, uint256 _amount) external {
        uint256 id = shipmentCount++;
        shipments[id] = Shipment(msg.sender, _receiver, ShipmentStatus.Pending, _amount);
        emit ShipmentCreated(id, msg.sender, _receiver, ShipmentStatus.Pending, _amount);
    }

    function updateShipmentStatus(uint256 _id, ShipmentStatus _status) external onlyShipper {
        require(_id < shipmentCount, "Invalid shipment ID");
        shipments[_id].status = _status;
        if (_status == ShipmentStatus.Delivered) {
            transfer(shipments[_id].receiver, shipments[_id].amount);
            emit ShipmentDelivered(_id, ShipmentStatus.Delivered);
        } else {
            emit ShipmentStatusUpdated(_id, _status);
        }
    }

    function grantShipperRole(address _account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(SHIPPER_ROLE, _account);
    }

    function revokeShipperRole(address _account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(SHIPPER_ROLE, _account);
    }
}

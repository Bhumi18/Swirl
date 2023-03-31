// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Swirl {

    
  struct Advertiser {
        uint256 id;
        address wallet;
        uint256 balance;
        string  orgUsername;
        string  orgname;
        string  orgLogo;
        string  orgdiscription;
        string  orgOrigin;
        string  empstrength;
        string  orgFounder;
        string  orgCatagory;
    }

struct Publisher {
        uint256 id;
        address wallet;
        string  orgUsername;
        string  orgname;
        string  orgLogo;
        string  orgdiscription;
        string  orgOrigin;
        string  empstrength;
        string  orgFounder;
        string  orgCatagory;
    }

   struct Campaign {
        uint256 id;
        uint256 advertiserId;
        uint256 balance;
        string  campaignName;
        string  budget;
        string  payclick;
        string  stringCID;
    }

    mapping(uint256 => Advertiser) private advertisers;
    mapping(uint256 => Campaign) private campaigns;
    mapping(uint256 => Publisher) private publishers;

    uint256 private advertiserCounter;
    uint256 private campaignCounter;
    uint256 private publisherCounter;

   function createAdvertiser(address _wallet,string memory _orgUsername, string memory _orgname, string memory _orgLogo, string memory _orgdiscription, string memory _orgOrigin, string memory _empstrength, string memory _orgFounder, string memory _orgCatagory) public {
    require(advertiserExists(_wallet) == false, "Advertiser already exists");
    advertiserCounter++;
    advertisers[advertiserCounter] = Advertiser(advertiserCounter, _wallet, 0,_orgUsername,_orgname,_orgLogo,_orgdiscription,_orgOrigin,_empstrength,_orgFounder,_orgCatagory);
}

function createPublisher(address _wallet,string memory _orgUsername, string memory _orgname, string memory _orgLogo, string memory _orgdiscription, string memory _orgOrigin, string memory _empstrength, string memory _orgFounder, string memory _orgCatagory) public {
    require(publisherExists(_wallet) == false, "Publisher already exists");
    publisherCounter++;
    publishers[publisherCounter] = Publisher(publisherCounter, _wallet,_orgUsername,_orgname,_orgLogo,_orgdiscription,_orgOrigin,_empstrength,_orgFounder,_orgCatagory);
}


function advertiserExists(address _wallet) private view returns (bool) {
    for (uint256 i = 1; i <= advertiserCounter; i++) {
        if (advertisers[i].wallet == _wallet) {
            return true;
        }
    }
    return false;
}

function publisherExists(address _wallet) private view returns (bool) {
    for (uint256 i = 1; i <= publisherCounter; i++) {
        if (publishers[i].wallet == _wallet) {
            return true;
        }
    }
    return false;
}

//    function createCampaign(address _advertiserAddress, uint256 _balance) public {
//     require(advertiserExists(_advertiserAddress) == true, "Advertiser does not exist");
//     uint256 advertiserId;
//     for (uint256 i = 1; i <= advertiserCounter; i++) {
//         if (advertisers[i].wallet == _advertiserAddress) {
//             advertiserId = i;
//             break;
//         }
//     }

//     campaignCounter++;
//     campaigns[campaignCounter] = Campaign(campaignCounter, advertiserId, _balance);
//     advertisers[advertiserId].balance += _balance;
// }

  function deposit(address _advertiserAddress)  public payable {
        uint256 advertiserId;
        for (uint256 i = 1; i <= advertiserCounter; i++) {
            if (advertisers[i].wallet == _advertiserAddress) {
                advertiserId = i;
                break;
            }
        }
        require(advertiserId > 0, "Advertiser does not exist");
        require(advertisers[advertiserId].wallet == msg.sender, "Only advertiser can deposit funds");

        advertisers[advertiserId].balance += msg.value;
    }
    function getAdvertiserBalance(address _wallet) public view returns (uint256) {
    for (uint256 i = 1; i <= advertiserCounter; i++) {
        if (advertisers[i].wallet == _wallet) {
            return advertisers[i].balance;
        }
    }
}
    function withdraw(uint256 _publisherId, uint256 _campaignId) public {
    require(_publisherId <= publisherCounter, "Publisher does not exist");
    require(_campaignId <= campaignCounter, "Campaign does not exist");
    require(publishers[_publisherId].wallet == msg.sender, "Only publisher can withdraw");

    uint256 balance = campaigns[_campaignId].balance;
    require(balance > 0, "Campaign balance is zero");

    campaigns[_campaignId].balance = 0;
    advertisers[campaigns[_campaignId].advertiserId].balance -= balance;
    address payable publisherWallet = payable(publishers[_publisherId].wallet);
    publisherWallet.transfer(balance);
}


function getAdvertiser(address _wallet) public view returns (uint256, address, uint256, string memory, string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
   
    for (uint256 i = 1; i <= advertiserCounter; i++) {
        if (advertisers[i].wallet == _wallet) {
            Advertiser memory advertiser = advertisers[i];
            return (advertiser.id, advertiser.wallet, advertiser.balance,advertiser.orgUsername,advertiser.orgname,advertiser.orgLogo,advertiser.orgdiscription,advertiser.orgOrigin,advertiser.empstrength,advertiser.orgFounder,advertiser.orgCatagory);
        }
    }
   
}

function getPublisher(address _wallet) public view returns (uint256, address, string memory, string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
   
    for (uint256 i = 1; i <= publisherCounter; i++) {
        if (publishers[i].wallet == _wallet) {
            Publisher memory publisher = publishers[i];
            return (publisher.id, publisher.wallet,publisher.orgUsername,publisher.orgname,publisher.orgLogo,publisher.orgdiscription,publisher.orgOrigin,publisher.empstrength,publisher.orgFounder,publisher.orgCatagory);
        }
    }
   
}


function getAllAdvertisers() public view returns (uint256[] memory ids,  address[] memory addresses, string[] memory orgUsernames, string[] memory orgnames, string[] memory orgLogos, string[] memory orgdiscriptions, string[] memory orgOrigins, string[] memory empstrengths, string[] memory orgFounders, string[] memory orgCatagories) {
    ids = new uint256[](advertiserCounter);
    addresses = new address[](advertiserCounter);
    orgUsernames = new string[](advertiserCounter);
    orgnames = new string[](advertiserCounter);
    orgLogos = new string[](advertiserCounter);
    orgdiscriptions = new string[](advertiserCounter);
    orgOrigins = new string[](advertiserCounter);
    empstrengths = new string[](advertiserCounter);
    orgFounders = new string[](advertiserCounter);
    orgCatagories = new string[](advertiserCounter);
    for (uint256 i = 1; i <= advertiserCounter; i++) {
        ids[i - 1] = advertisers[i].id;
        addresses[i - 1] = advertisers[i].wallet;
        orgUsernames[i - 1] = advertisers[i].orgUsername;
        orgnames[i - 1] = advertisers[i].orgname;
        orgLogos[i - 1] = advertisers[i].orgLogo;
        orgdiscriptions[i - 1] = advertisers[i].orgdiscription;
        orgOrigins[i - 1] = advertisers[i].orgOrigin;
        empstrengths[i - 1] = advertisers[i].empstrength;
        orgFounders[i - 1] = advertisers[i].orgFounder;
        orgCatagories[i - 1] = advertisers[i].orgCatagory;
    }
    return (ids, addresses, orgUsernames, orgnames, orgLogos, orgdiscriptions, orgOrigins, empstrengths, orgFounders, orgCatagories);
}

    // function getPublisher(uint256 _publisherId) public view returns (uint256, address) {
    //     require(_publisherId <= publisherCounter, "Publisher does not exist");

    //     Publisher memory publisher = publishers[_publisherId];
    //     return (publisher.id, publisher.wallet);
    // }

function getAllPublishers() public view returns (uint256[] memory ids,  address[] memory addresses, string[] memory orgUsernames, string[] memory orgnames, string[] memory orgLogos, string[] memory orgdiscriptions, string[] memory orgOrigins, string[] memory empstrengths, string[] memory orgFounders, string[] memory orgCatagories) {
     ids = new uint256[](publisherCounter);
     addresses = new address[](publisherCounter);
      orgUsernames = new string[](publisherCounter);
      orgnames = new string[](publisherCounter);
 orgLogos = new string[](publisherCounter);
      orgdiscriptions = new string[](publisherCounter);
      orgOrigins = new string[](publisherCounter);
      empstrengths = new string[](publisherCounter);
      orgFounders = new string[](publisherCounter);
     orgCatagories = new string[](publisherCounter);
   
    for (uint256 i = 1; i <= publisherCounter; i++) {
        
        ids[i - 1] = publishers[i].id;
        addresses[i - 1] = publishers[i].wallet;
        orgUsernames[i - 1] = publishers[i].orgUsername;
        orgnames[i - 1] = publishers[i].orgname;
        orgLogos[i - 1] = publishers[i].orgLogo;
        orgdiscriptions[i - 1] = publishers[i].orgdiscription;
        orgOrigins[i - 1] = publishers[i].orgOrigin;
        empstrengths[i - 1] = publishers[i].empstrength;
        orgFounders[i - 1] = publishers[i].orgFounder;
        orgCatagories[i - 1] = publishers[i].orgCatagory;
    }
    return (ids, addresses,orgUsernames,orgnames,orgLogos,orgdiscriptions,orgOrigins,empstrengths,orgFounders,orgCatagories);
}
function createCampaign(address _advertiserAddress, uint256 _balance, string memory _campaignName, string memory _budget, string memory _payclick, string memory _stringCID) public {
    require(advertiserExists(_advertiserAddress) == true, "Advertiser does not exist");
    uint256 advertiserId;
    for (uint256 i = 1; i <= advertiserCounter; i++) {
        if (advertisers[i].wallet == _advertiserAddress) {
            advertiserId = i;
            break;
        }
    }

    require(advertisers[advertiserId].balance >= _balance, "Balance of advertiser is not enough");

    campaignCounter++;
    campaigns[campaignCounter] = Campaign(campaignCounter, advertiserId, _balance, _campaignName, _budget, _payclick, _stringCID);
    advertisers[advertiserId].balance -= _balance;
}

function getCampaign(address _advertiserAddress) public view returns (uint256[] memory ids,  uint256[] memory balances, string[] memory campaignNames, string[] memory budgets, string[] memory payclicks, string[] memory stringCIDs) {
    ids = new uint256[](campaignCounter);
    balances = new uint256[](campaignCounter);
    campaignNames = new string[](campaignCounter);
    budgets = new string[](campaignCounter);
    payclicks = new string[](campaignCounter);
    stringCIDs = new string[](campaignCounter);
    for (uint256 i = 1; i <= campaignCounter; i++) {
        if (advertisers[campaigns[i].advertiserId].wallet == _advertiserAddress) {
            ids[i - 1] = campaigns[i].id;
            balances[i - 1] = campaigns[i].balance;
            campaignNames[i - 1] = campaigns[i].campaignName;
            budgets[i - 1] = campaigns[i].budget;
            payclicks[i - 1] = campaigns[i].payclick;
            stringCIDs[i - 1] = campaigns[i].stringCID;
        }
    }
    return (ids, balances, campaignNames, budgets, payclicks, stringCIDs);
}


function getAllCampaigns() public view returns (uint256[] memory ids,  address[] memory advertiserIds, uint256[] memory balances, string[] memory campaignNames, string[] memory budgets, string[] memory payclicks, string[] memory stringCIDs) {
    ids = new uint256[](campaignCounter);
    advertiserIds = new address[](campaignCounter);
    balances = new uint256[](campaignCounter);
    campaignNames = new string[](campaignCounter);
    budgets = new string[](campaignCounter);
    payclicks = new string[](campaignCounter);
    stringCIDs = new string[](campaignCounter);
    for (uint256 i = 1; i <= campaignCounter; i++) {
        ids[i - 1] = campaigns[i].id;
        advertiserIds[i - 1] = advertisers[campaigns[i].advertiserId].wallet;
        balances[i - 1] = campaigns[i].balance;
        campaignNames[i - 1] = campaigns[i].campaignName;
        budgets[i - 1] = campaigns[i].budget;
        payclicks[i - 1] = campaigns[i].payclick;
        stringCIDs[i - 1] = campaigns[i].stringCID;
    }
    return (ids, advertiserIds, balances, campaignNames, budgets, payclicks, stringCIDs);
}

}

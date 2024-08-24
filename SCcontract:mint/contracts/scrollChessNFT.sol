// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract scrollChessNFT is ERC721, Ownable {
    uint256 public totalMints = 0;
    uint256 public mintPrice = 0.001 ether;
    uint256 public maxSupply = 5000;
    uint256 public maxPerWallet = 1;
    string[] public imageURIs;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256) public walletMints;

    constructor(string[] memory _imageURIs) ERC721("scrollChessNFT", "SCHNFT") Ownable(msg.sender) {
        imageURIs = _imageURIs;
    }

    function safeMint(address to) internal {
        require(totalMints < maxSupply, "Max supply reached");
        uint256 tokenId = totalMints;
        totalMints++;

        uint256 randomIndex = _random() % imageURIs.length;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, imageURIs[randomIndex]);
    }

    function mintToken() public payable {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(walletMints[msg.sender] < maxPerWallet, "Mint limit per wallet exceeded");

        walletMints[msg.sender] += 1;
        safeMint(msg.sender);
    }

    function getMyWalletMints() public view returns (uint256) {
        return walletMints[msg.sender];
    }

    function _random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, totalMints)));
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        require(_exists(tokenId), "URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");

        return _tokenURIs[tokenId];
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return ownerOf(tokenId) != address(0);
    }
}
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const imageURIs = [

            "ipfs://QmSCJfU559AGbxNXwuEekfyMffu7YhtEMRtcA6SkqGza6S",
            "ipfs://QmY1AdWUQ4ARtohePLHVB4vSUGSZ5ZNcHo7m6qdHKXDW5T",
            "ipfs://QmaHD5kmiXTZi4rsh6yqNgBPDRZU7MUox34ong6xz9XW9J",
            "ipfs://QmVKuHkK7qVe1xpEfiXqKvxugMzQ9bYS5pjy8r5fGVTRn4"
    ];

    const ScrollChessNFT = await ethers.getContractFactory("scrollChessNFT");
    const scrollChessNFT = await ScrollChessNFT.deploy(imageURIs);

    console.log("ScrollChessNFT deployed to:", scrollChessNFT.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SkillStamp
 * @dev Soulbound NFT certificate system with issuer/learner two-sided flow,
 *      on-chain scores, and leaderboard events.
 */
contract SkillStamp {
    // ─── Structs ───────────────────────────────────────────────────────────────

    struct Quiz {
        uint256 id;
        address issuer;
        string title;
        string skill;
        string questionsJson; // JSON string of questions stored on-chain
        uint8 passingScore;   // 0-100
        bool active;
        uint256 createdAt;
    }

    struct Certificate {
        uint256 tokenId;
        uint256 quizId;
        address learner;
        uint8 score;
        uint256 issuedAt;
        string skill;
        string quizTitle;
        address issuer;
    }

    // ─── State ─────────────────────────────────────────────────────────────────

    string public name = "SkillStamp Certificate";
    string public symbol = "SSKILL";

    uint256 private _quizCounter;
    uint256 private _tokenCounter;

    mapping(uint256 => Quiz) public quizzes;
    mapping(uint256 => Certificate) public certificates;

    // learner => quizId => tokenId (0 means not minted)
    mapping(address => mapping(uint256 => uint256)) public learnerCertificate;

    // learner => list of tokenIds
    mapping(address => uint256[]) private _learnerTokens;

    // tokenId => owner (soulbound — no transfers)
    mapping(uint256 => address) private _tokenOwner;

    // quizId => list of tokenIds (for leaderboard)
    mapping(uint256 => uint256[]) private _quizCertificates;

    // issuer => list of quizIds
    mapping(address => uint256[]) private _issuerQuizzes;

    // ─── Events ────────────────────────────────────────────────────────────────

    event QuizCreated(
        uint256 indexed quizId,
        address indexed issuer,
        string title,
        string skill
    );

    event CertificateMinted(
        uint256 indexed tokenId,
        uint256 indexed quizId,
        address indexed learner,
        uint8 score,
        string skill,
        address issuer
    );

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    // ─── Modifiers ─────────────────────────────────────────────────────────────

    modifier quizExists(uint256 quizId) {
        require(quizId > 0 && quizId <= _quizCounter, "Quiz does not exist");
        _;
    }

    modifier quizActive(uint256 quizId) {
        require(quizzes[quizId].active, "Quiz is not active");
        _;
    }

    // ─── Issuer Functions ──────────────────────────────────────────────────────

    /**
     * @dev Create a new quiz. Questions stored as JSON string.
     * @param title Human-readable quiz title
     * @param skill Skill being certified (e.g. "React", "Solidity")
     * @param questionsJson JSON array of questions with options and answers
     * @param passingScore Minimum score (0-100) to earn certificate
     */
    function createQuiz(
        string calldata title,
        string calldata skill,
        string calldata questionsJson,
        uint8 passingScore
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title required");
        require(bytes(skill).length > 0, "Skill required");
        require(passingScore <= 100, "Passing score must be 0-100");

        _quizCounter++;
        uint256 quizId = _quizCounter;

        quizzes[quizId] = Quiz({
            id: quizId,
            issuer: msg.sender,
            title: title,
            skill: skill,
            questionsJson: questionsJson,
            passingScore: passingScore,
            active: true,
            createdAt: block.timestamp
        });

        _issuerQuizzes[msg.sender].push(quizId);

        emit QuizCreated(quizId, msg.sender, title, skill);
        return quizId;
    }

    /**
     * @dev Toggle quiz active/inactive
     */
    function toggleQuiz(uint256 quizId) external quizExists(quizId) {
        require(quizzes[quizId].issuer == msg.sender, "Not quiz issuer");
        quizzes[quizId].active = !quizzes[quizId].active;
    }

    // ─── Learner Functions ─────────────────────────────────────────────────────

    /**
     * @dev Mint a soulbound certificate after passing a quiz.
     *      Score verification is done off-chain; issuer signature validates it.
     * @param quizId The quiz that was completed
     * @param score The learner's score (0-100)
     * @param issuerSignature Signature from the quiz issuer validating the score
     */
    function mintCertificate(
        uint256 quizId,
        uint8 score,
        bytes calldata issuerSignature
    ) external quizExists(quizId) quizActive(quizId) {
        require(
            learnerCertificate[msg.sender][quizId] == 0,
            "Certificate already minted for this quiz"
        );

        Quiz storage quiz = quizzes[quizId];
        require(score >= quiz.passingScore, "Score below passing threshold");

        // Verify issuer signed: keccak256(learner, quizId, score)
        bytes32 messageHash = keccak256(
            abi.encodePacked(msg.sender, quizId, score)
        );
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        address recovered = _recoverSigner(ethSignedHash, issuerSignature);
        require(recovered == quiz.issuer, "Invalid issuer signature");

        // Mint
        _tokenCounter++;
        uint256 tokenId = _tokenCounter;

        certificates[tokenId] = Certificate({
            tokenId: tokenId,
            quizId: quizId,
            learner: msg.sender,
            score: score,
            issuedAt: block.timestamp,
            skill: quiz.skill,
            quizTitle: quiz.title,
            issuer: quiz.issuer
        });

        _tokenOwner[tokenId] = msg.sender;
        learnerCertificate[msg.sender][quizId] = tokenId;
        _learnerTokens[msg.sender].push(tokenId);
        _quizCertificates[quizId].push(tokenId);

        emit Transfer(address(0), msg.sender, tokenId);
        emit CertificateMinted(tokenId, quizId, msg.sender, score, quiz.skill, quiz.issuer);
    }

    // ─── View Functions ────────────────────────────────────────────────────────

    function totalQuizzes() external view returns (uint256) {
        return _quizCounter;
    }

    function totalCertificates() external view returns (uint256) {
        return _tokenCounter;
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        require(_tokenOwner[tokenId] != address(0), "Token does not exist");
        return _tokenOwner[tokenId];
    }

    function getLearnerCertificates(address learner)
        external
        view
        returns (uint256[] memory)
    {
        return _learnerTokens[learner];
    }

    function getIssuerQuizzes(address issuer)
        external
        view
        returns (uint256[] memory)
    {
        return _issuerQuizzes[issuer];
    }

    function getQuizLeaderboard(uint256 quizId)
        external
        view
        quizExists(quizId)
        returns (Certificate[] memory)
    {
        uint256[] storage tokenIds = _quizCertificates[quizId];
        Certificate[] memory board = new Certificate[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            board[i] = certificates[tokenIds[i]];
        }
        return board;
    }

    function getAllQuizzes() external view returns (Quiz[] memory) {
        Quiz[] memory all = new Quiz[](_quizCounter);
        for (uint256 i = 1; i <= _quizCounter; i++) {
            all[i - 1] = quizzes[i];
        }
        return all;
    }

    // ─── Soulbound — transfers disabled ───────────────────────────────────────

    function transferFrom(address, address, uint256) external pure {
        revert("SkillStamp: certificates are soulbound and non-transferable");
    }

    function safeTransferFrom(address, address, uint256) external pure {
        revert("SkillStamp: certificates are soulbound and non-transferable");
    }

    // ─── Internal ──────────────────────────────────────────────────────────────

    function _recoverSigner(bytes32 hash, bytes memory sig)
        internal
        pure
        returns (address)
    {
        require(sig.length == 65, "Invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        if (v < 27) v += 27;
        return ecrecover(hash, v, r, s);
    }
}

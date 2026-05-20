export const ZEROGAS_ABI = [
  // Quiz creation
  "function createQuiz(string title, string skill, string questionsJson, uint8 passingScore) external returns (uint256)",
  "function toggleQuiz(uint256 quizId) external",

  // Certificate minting
  "function mintCertificate(uint256 quizId, uint8 score, bytes issuerSignature) external",

  // Views
  "function totalQuizzes() external view returns (uint256)",
  "function totalCertificates() external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function getLearnerCertificates(address learner) external view returns (uint256[])",
  "function getIssuerQuizzes(address issuer) external view returns (uint256[])",
  "function getQuizLeaderboard(uint256 quizId) external view returns (tuple(uint256 tokenId, uint256 quizId, address learner, uint8 score, uint256 issuedAt, string skill, string quizTitle, address issuer)[])",
  "function getAllQuizzes() external view returns (tuple(uint256 id, address issuer, string title, string skill, string questionsJson, uint8 passingScore, bool active, uint256 createdAt)[])",
  "function quizzes(uint256) external view returns (uint256 id, address issuer, string title, string skill, string questionsJson, uint8 passingScore, bool active, uint256 createdAt)",
  "function certificates(uint256) external view returns (uint256 tokenId, uint256 quizId, address learner, uint8 score, uint256 issuedAt, string skill, string quizTitle, address issuer)",
  "function learnerCertificate(address, uint256) external view returns (uint256)",

  // Events
  "event QuizCreated(uint256 indexed quizId, address indexed issuer, string title, string skill)",
  "event CertificateMinted(uint256 indexed tokenId, uint256 indexed quizId, address indexed learner, uint8 score, string skill, address issuer)",
];

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

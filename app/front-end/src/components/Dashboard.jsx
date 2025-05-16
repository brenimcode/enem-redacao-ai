import React, { useState } from "react";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [score, setScore] = useState(null); // Adicionando o estado para o score
  const [competencies, setCompetencies] = useState([]); // Adicionando o estado para competencies

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes("image")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      console.warn("Nenhum arquivo selecionado.");
      alert("Por favor, selecione uma imagem da sua redação.");
      return;
    }

    console.log("Iniciando envio da redação...");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const token = localStorage.getItem("authToken");
      const tokenType = localStorage.getItem("tokenType");

      console.log("Token recuperado:", token);
      console.log("Tipo de token:", tokenType);

      const response = await fetch("http://localhost:8000/redacao", {
        method: "POST",
        headers: {
          "Authorization": `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${token}`,
        },
        body: formData,
      }); 

      console.log("Resposta recebida:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na resposta: ${response.status} - ${errorText}`);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Dados recebidos da API:", data);

      // Atualiza os estados necessários no Dashboard
      setDescription(data.description);
      setScore(data.score); // Atualiza o estado do score
      setCompetencies(data.competencies); // Atualiza o estado das competências

      console.log("Redação processada com sucesso.");
    } catch (err) {
      console.error("Erro ao enviar redação:", err);
      alert("Erro ao processar redação. Veja o console para detalhes.");
    } finally {
      console.log("Finalizando envio da redação.");
      setLoading(false);
    }
  };

  const resetForm = () => {
    console.log("Resetando formulário...");
    setSelectedFile(null);
    setPreview(null);
    setDescription("");
    setScore(null); // Reseta o estado do score
    setCompetencies([]); // Reseta o estado das competências
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoText}>Redator AI</span>
        </div>
        <div style={{ ...styles.menuItem, ...styles.menuItemActive }}>
          <span style={styles.menuIcon}>📝</span>
          <span style={styles.menuText}>Correção</span>
        </div>
        <div style={styles.menuItem}>
          <span style={styles.menuIcon}>📊</span>
          <span style={styles.menuText}>Histórico</span>
        </div>
        <div style={styles.menuItem}>
          <span style={styles.menuIcon}>🔍</span>
          <span style={styles.menuText}>Exemplos</span>
        </div>
        <div style={styles.menuItem}>
          <span style={styles.menuIcon}>⚙️</span>
          <span style={styles.menuText}>Configurações</span>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>Correção de Redação</h1>
          <div style={styles.userProfile}>
            <span style={styles.username}>
              {localStorage.getItem("username") || "Usuário"}
            </span>
            <div style={styles.avatar}>
              {(localStorage.getItem("username") || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>

        <div style={styles.contentArea}>
          <div style={styles.uploadArea}>
            <div 
              style={{
                ...styles.dropzone,
                ...(dragActive ? styles.dropzoneActive : {}),
                ...(preview ? styles.dropzoneWithPreview : {})
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!preview ? (
                <>
                  <div style={styles.uploadIcon}>📄</div>
                  <p style={styles.uploadText}>
                    Arraste a imagem da sua redação aqui<br />
                    <span style={styles.uploadSubtext}>ou</span>
                  </p>
                  <label style={styles.fileInputLabel}>
                    Selecione um arquivo
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/jpg"
                      onChange={handleFileChange}
                      style={styles.fileInput}
                    />
                  </label>
                  <p style={styles.formatText}>
                    Formatos aceitos: JPG, PNG, JPEG
                  </p>
                </>
              ) : (
                <div style={styles.previewContainer}>
                  <img src={preview} alt="Preview" style={styles.imagePreview} />
                  <div style={styles.previewActions}>
                    <span style={styles.fileName}>{selectedFile.name}</span>
                    <button onClick={resetForm} style={styles.removeButton}>
                      Remover
                    </button>
                  </div>
                </div>
              )}
            </div>

            {preview && (
              <button 
                onClick={handleSubmit} 
                style={loading ? {...styles.submitButton, ...styles.submitButtonLoading} : styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Analisando redação...' : 'Enviar para correção'}
              </button>
            )}
          </div>

          {description && (
            <div style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <h2 style={styles.resultTitle}>Resultado da análise</h2>
                <div style={styles.resultTime}>{new Date().toLocaleString()}</div>
              </div>
              <div style={styles.resultContent}>
                <div style={styles.feedbackSection}>
                  <h3 style={styles.feedbackTitle}>Feedback da redação</h3>
                  <p style={styles.feedbackText}>{description}</p>
                </div>
                <div style={styles.scoreSection}>
                  <div style={styles.scoreCircle}>
                    <span style={styles.scoreNumber}>{score}</span>
                    <span style={styles.scoreTotal}>/1000</span>
                  </div>
                  <div style={styles.scoreCriteria}>
                    {competencies.map((competencyScore, index) => (
                      <div key={index} style={styles.criteriaItem}>
                        <span style={styles.criteriaLabel}>Competência {index + 1}</span>
                        <div style={styles.criteriaBar}>
                          <div
                            style={{
                              ...styles.criteriaFill,
                              width: `${(competencyScore / 200) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span style={styles.criteriaScore}>{competencyScore}/200</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={styles.resultActions}>
                <button style={styles.actionButtonOutline} onClick={resetForm}>Nova correção</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* ------------------------ STYLES -------------------------*/

const styles = {
  pageContainer: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "row",
    backgroundColor: "#f8f9fc",
    overflow: "hidden",
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
  sidebar: {
    width: "240px",
    backgroundColor: "#1a2236",
    color: "#ffffff",
    padding: "24px 0",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    padding: "0 24px",
    marginBottom: "40px",
    display: "flex",
    alignItems: "center",
  },
  logoText: {
    fontSize: "1.5rem",
    fontWeight: "700",
    backgroundImage: "linear-gradient(45deg, #1658ff,rgb(46, 165, 250))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  menuItem: {
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    cursor: "default", // Cursor padrão para itens desativados
    transition: "background-color 0.2s",
    borderLeft: "4px solid transparent",
    marginBottom: "4px",
    color: "#9CA3AF", // Cinza claro para itens desativados
    backgroundColor: "transparent", // Fundo transparente para itens desativados
    ":hover": {
      backgroundColor: "transparent", // Sem efeito de hover para itens desativados
    },
  },
  menuItemActive: {
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer", // Cursor de ponteiro para itens ativos
    transition: "background-color 0.2s",
    borderLeft: "4px solid #1658ff", // Destaque azul para o item ativo
    marginBottom: "4px",
    color: "#FFFFFF", // Branco para o texto do item ativo
    backgroundColor: "rgba(22, 88, 255, 0.1)", // Fundo azul claro para o item ativo
    ":hover": {
      backgroundColor: "rgba(22, 88, 255, 0.2)", // Efeito de hover para o item ativo
    },
  },
  menuIcon: {
    marginRight: "12px",
    fontSize: "18px",
  },
  menuText: {
    fontSize: "0.9rem",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  username: {
    fontSize: "0.9rem",
    color: "#64748b",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#1658ff",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },
  contentArea: {
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    flex: 1,
  },
  uploadArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  dropzone: {
    width: "100%",
    maxWidth: "600px",
    height: "300px",
    border: "2px dashed #cbd5e1",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    backgroundColor: "#ffffff",
    transition: "all 0.2s",
    cursor: "pointer",
  },
  dropzoneActive: {
    borderColor: "#1658ff",
    backgroundColor: "rgba(99, 102, 241, 0.05)",
  },
  dropzoneWithPreview: {
    height: "auto",
    justifyContent: "flex-start",
  },
  uploadIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    color: "#64748b",
  },
  uploadText: {
    fontSize: "1.1rem",
    color: "#334155",
    margin: "0 0 16px 0",
    textAlign: "center",
  },
  uploadSubtext: {
    color: "#64748b",
    fontSize: "0.9rem",
  },
  fileInputLabel: {
    padding: "12px 24px",
    backgroundColor: "#1658ff",
    color: "#ffffff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
    marginBottom: "16px",
    ":hover": {
      backgroundColor: "#4f46e5",
    },
  },
  fileInput: {
    display: "none",
  },
  formatText: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    margin: 0,
  },
  previewContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  imagePreview: {
    maxWidth: "100%",
    maxHeight: "400px",
    borderRadius: "8px",
    objectFit: "contain",
    marginBottom: "16px",
  },
  previewActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "8px 0",
  },
  fileName: {
    fontSize: "0.9rem",
    color: "#64748b",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    maxWidth: "70%",
  },
  removeButton: {
    backgroundColor: "transparent",
    color: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
    },
  },
  submitButton: {
    marginTop: "24px",
    padding: "14px 32px",
    backgroundColor: "#1658ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#4f46e5",
    },
  },
  submitButtonLoading: {
    backgroundColor: "#a5b4fc",
    cursor: "not-allowed",
  },
  resultCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    marginTop: "32px",
  },
  resultHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultTitle: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  resultTime: {
    fontSize: "0.8rem",
    color: "#64748b",
  },
  resultContent: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  feedbackSection: {
    marginBottom: "24px",
  },
  feedbackTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#334155",
    marginTop: 0,
    marginBottom: "12px",
  },
  feedbackText: {
    fontSize: "1rem",
    color: "#475569",
    lineHeight: "1.6",
    margin: 0,
  },
  scoreSection: {
    display: "flex",
    alignItems: "flex-start",
    gap: "32px",
    padding: "24px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  scoreCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    position: "relative",
  },
  scoreNumber: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#1658ff",
    lineHeight: 1,
  },
  scoreTotal: {
    fontSize: "0.9rem",
    color: "#94a3b8",
  },
  scoreCriteria: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  criteriaItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  criteriaLabel: {
    fontSize: "0.9rem",
    color: "#64748b",
    width: "120px",
  },
  criteriaBar: {
    flex: 1,
    height: "8px",
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  criteriaFill: {
    height: "100%",
    backgroundColor: "#1658ff",
    borderRadius: "4px",
  },
  criteriaScore: {
    fontSize: "0.9rem",
    color: "#334155",
    width: "70px",
    textAlign: "right",
  },
  resultActions: {
    padding: "20px 24px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  actionButton: {
    padding: "10px 16px",
    backgroundColor: "#1658ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#4f46e5",
    },
  },
  actionButtonOutline: {
    padding: "10px 16px",
    backgroundColor: "transparent",
    color: "#1658ff",
    border: "1px solid #1658ff",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "rgba(99, 102, 241, 0.05)",
    },
  },
};

export default Dashboard;
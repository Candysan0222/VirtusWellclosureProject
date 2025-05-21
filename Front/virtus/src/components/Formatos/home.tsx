import React, { useState, ChangeEvent, FormEvent } from "react";
import {
    Container,
    Form,
    Button,
    Card,
    Row,
    Col,
    Badge,
    Alert,
    Toast,
    ToastContainer,
    Navbar
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faExclamationTriangle,
    faPaperPlane,
    faSave
} from '@fortawesome/free-solid-svg-icons';
// Asumimos que la ruta del archivo de estilos es correcta
// import "./servicios/componentes/styles/App.css";

// Tipos para cada sección
type SectionStatus = "approved" | "reported" | null;
type SectionWithData = "generalInfo" | "wellStatus" | "riskAssessment";

interface SectionData {
    [key: string]: string;
}

interface Section {
    status: SectionStatus;
    observation: string;
    data: SectionData;
    showDetails: boolean;
}

interface SectionsState {
    generalInfo: Section;
    wellStatus: Section;
    riskAssessment: Section;
    finalObservations: {
        comments: string;
        showDetails: boolean;
    };
    approval: {
        company: string;
        position: string;
        showDetails: boolean;
    };
}

interface FormStatus {
    isSubmitted: boolean;
    isComplete: boolean;
    showToast: boolean;
    message: string;
}

function Home() {
    const [sections, setSections] = useState<SectionsState>({
        generalInfo: {
            status: null,
            observation: "",
            data: {
                wellName: "",
                location: "",
                operator: "",
                evaluationDate: ""
            },
            showDetails: true
        },
        wellStatus: {
            status: null,
            observation: "",
            data: {
                totalDepth: "",
                wellType: "",
                currentStatus: "",
                currentPressure: ""
            },
            showDetails: true
        },
        riskAssessment: {
            status: null,
            observation: "",
            data: {
                residualHydrocarbons: "",
                casingCondition: "",
                cementCondition: "",
                environmentalRisk: ""
            },
            showDetails: true
        },
        finalObservations: {
            comments: "",
            showDetails: true
        },
        approval: {
            company: "",
            position: "",
            showDetails: true
        }
    });

    const [formStatus, setFormStatus] = useState<FormStatus>({
        isSubmitted: false,
        isComplete: false,
        showToast: false,
        message: ""
    });

    const handleSectionStatus = (section: keyof SectionsState, status: SectionStatus) => {
        setSections(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                status
            }
        }));
    };

    const handleObservationChange = (section: keyof SectionsState, value: string) => {
        setSections(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                observation: value
            }
        }));
    };

    const handleDataChange = (section: SectionWithData, field: string, value: string) => {
        setSections(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                data: {
                    ...prev[section].data,
                    [field]: value
                }
            }
        }));
    };

    const handleCommentChange = (value: string) => {
        setSections(prev => ({
            ...prev,
            finalObservations: {
                ...prev.finalObservations,
                comments: value
            }
        }));
    };

    const handleApprovalChange = (field: "company" | "position", value: string) => {
        setSections(prev => ({
            ...prev,
            approval: {
                ...prev.approval,
                [field]: value
            }
        }));
    };

    const toggleSection = (section: keyof SectionsState) => {
        setSections(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                showDetails: !prev[section].showDetails
            }
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const requiredSections = ["generalInfo", "wellStatus", "riskAssessment"] as const;
        const allSectionsReviewed = requiredSections.every(
            section => sections[section].status !== null
        );
        const approvalComplete = sections.approval.company && sections.approval.position;

        if (!allSectionsReviewed) {
            setFormStatus({
                ...formStatus,
                showToast: true,
                message: "Debe revisar y aprobar o reportar todas las secciones."
            });
            return;
        }

        if (!approvalComplete) {
            setFormStatus({
                ...formStatus,
                showToast: true,
                message: "Debe completar la información de aprobación."
            });
            return;
        }

        console.log("Formulario enviado con éxito:", sections);
        setFormStatus({
            isSubmitted: true,
            isComplete: true,
            showToast: true,
            message: "Formulario enviado con éxito."
        });
    };

    const handleSaveDraft = () => {
        console.log("Guardando borrador:", sections);
        setFormStatus({
            ...formStatus,
            showToast: true,
            message: "Borrador guardado con éxito."
        });
    };

    const renderStatusBadge = (status: SectionStatus) => {
        if (status === null) return <Badge bg="secondary">Pendiente</Badge>;
        if (status === "approved") return <Badge bg="success">Aprobado</Badge>;
        if (status === "reported") return <Badge bg="danger">Reportado</Badge>;
    };

    const closeToast = () => {
        setFormStatus({
            ...formStatus,
            showToast: false
        });
    };

    // Estilos para el dashboard
    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
        },
        header: {
            marginBottom: '20px',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '15px'
        },
        title: {
            fontSize: '24px',
            color: '#2c3e50',
        },
        card: {
            marginBottom: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 20px',
            backgroundColor: '#f8f9fa',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            cursor: 'pointer'
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '30px'
        }
    };

    return (
        <Container style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Dashboard de Evaluación de Pozos</h1>
                <p>Complete la información requerida y revise cada sección.</p>
            </div>

            <Form onSubmit={handleSubmit}>
                {/* Sección de Información General */}
                <Card style={styles.card}>
                    <div
                        style={styles.cardHeader}
                        onClick={() => toggleSection("generalInfo")}
                    >
                        <h2>1. Información General {renderStatusBadge(sections.generalInfo.status)}</h2>
                        <span>{sections.generalInfo.showDetails ? '▲' : '▼'}</span>
                    </div>

                    {sections.generalInfo.showDetails && (
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre del Pozo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={sections.generalInfo.data.wellName}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleDataChange("generalInfo", "wellName", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ubicación</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={sections.generalInfo.data.location}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleDataChange("generalInfo", "location", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Operador</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={sections.generalInfo.data.operator}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleDataChange("generalInfo", "operator", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Fecha de Evaluación</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={sections.generalInfo.data.evaluationDate}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleDataChange("generalInfo", "evaluationDate", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Observaciones</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={sections.generalInfo.observation}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleObservationChange("generalInfo", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button
                                        variant="success"
                                        className="me-2"
                                        onClick={() => handleSectionStatus("generalInfo", "approved")}
                                    >
                                        <Button
                                            variant="success"
                                            className="me-2 d-flex align-items-center"
                                            onClick={() => handleSectionStatus("generalInfo", "approved")}
                                        >
                                            <FontAwesomeIcon icon={faCheck} className="me-2" /> Aprobar
                                        </Button>
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleSectionStatus("generalInfo", "reported")}
                                    >
                                        <Button
                                            variant="danger"
                                            className="d-flex align-items-center"
                                            onClick={() => handleSectionStatus("generalInfo", "reported")}
                                        >
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> Reportar
                                        </Button>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    )}
                </Card>

                {/* Sección de Estado del Pozo */}
                <Card style={styles.card}>
                    <div
                        style={styles.cardHeader}
                        onClick={() => toggleSection("wellStatus")}
                    >
                        <h2>2. Estado del Pozo {renderStatusBadge(sections.wellStatus.status)}</h2>
                        <span>{sections.wellStatus.showDetails ? '▲' : '▼'}</span>
                    </div>

                    {sections.wellStatus.showDetails && (
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Profundidad Total (m)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={sections.wellStatus.data.totalDepth}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleDataChange("wellStatus", "totalDepth", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tipo de Pozo</Form.Label>
                                        <Form.Select
                                            value={sections.wellStatus.data.wellType}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                                handleDataChange("wellStatus", "wellType", e.target.value)}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Exploratorio">Exploratorio</option>
                                            <option value="Desarrollo">Desarrollo</option>
                                            <option value="Inyector">Inyector</option>
                                            <option value="Abandonado">Abandonado</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Estado Actual</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={sections.wellStatus.data.currentStatus}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleDataChange("wellStatus", "currentStatus", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Presión Actual (psi)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={sections.wellStatus.data.currentPressure}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleDataChange("wellStatus", "currentPressure", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Observaciones</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={sections.wellStatus.observation}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleObservationChange("wellStatus", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button
                                        variant="success"
                                        className="me-2"
                                        onClick={() => handleSectionStatus("wellStatus", "approved")}
                                    >
                                        <Button
                                            variant="success"
                                            className="me-2 d-flex align-items-center"
                                            onClick={() => handleSectionStatus("wellStatus", "approved")}
                                        >
                                            <FontAwesomeIcon icon={faCheck} className="me-2" /> Aprobar
                                        </Button>
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleSectionStatus("wellStatus", "reported")}
                                    >
                                        <Button
                                            variant="danger"
                                            className="d-flex align-items-center"
                                            onClick={() => handleSectionStatus("wellStatus", "reported")}
                                        >
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> Reportar
                                        </Button>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    )}
                </Card>

                {/* Sección de Evaluación de Riesgos */}
                <Card style={styles.card}>
                    <div
                        style={styles.cardHeader}
                        onClick={() => toggleSection("riskAssessment")}
                    >
                        <h2>3. Evaluación de Riesgos {renderStatusBadge(sections.riskAssessment.status)}</h2>
                        <span>{sections.riskAssessment.showDetails ? '▲' : '▼'}</span>
                    </div>

                    {sections.riskAssessment.showDetails && (
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Hidrocarburos Residuales</Form.Label>
                                        <Form.Select
                                            value={sections.riskAssessment.data.residualHydrocarbons}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                                handleDataChange("riskAssessment", "residualHydrocarbons", e.target.value)}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Alto">Alto</option>
                                            <option value="Medio">Medio</option>
                                            <option value="Bajo">Bajo</option>
                                            <option value="Ninguno">Ninguno</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Condición del Revestimiento</Form.Label>
                                        <Form.Select
                                            value={sections.riskAssessment.data.casingCondition}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                                handleDataChange("riskAssessment", "casingCondition", e.target.value)}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Buena">Buena</option>
                                            <option value="Regular">Regular</option>
                                            <option value="Mala">Mala</option>
                                            <option value="Crítica">Crítica</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Condición del Cemento</Form.Label>
                                        <Form.Select
                                            value={sections.riskAssessment.data.cementCondition}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                                handleDataChange("riskAssessment", "cementCondition", e.target.value)}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Buena">Buena</option>
                                            <option value="Regular">Regular</option>
                                            <option value="Mala">Mala</option>
                                            <option value="Crítica">Crítica</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Riesgo Ambiental</Form.Label>
                                        <Form.Select
                                            value={sections.riskAssessment.data.environmentalRisk}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                                handleDataChange("riskAssessment", "environmentalRisk", e.target.value)}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Alto">Alto</option>
                                            <option value="Medio">Medio</option>
                                            <option value="Bajo">Bajo</option>
                                            <option value="Ninguno">Ninguno</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Observaciones</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={sections.riskAssessment.observation}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleObservationChange("riskAssessment", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button
                                        variant="success"
                                        className="me-2"
                                        onClick={() => handleSectionStatus("riskAssessment", "approved")}
                                    >
                                        <Button
                                            variant="success"
                                            className="me-2 d-flex align-items-center"
                                            onClick={() => handleSectionStatus("riskAssessment", "approved")}
                                        >
                                            <FontAwesomeIcon icon={faCheck} className="me-2" /> Aprobar
                                        </Button>
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleSectionStatus("riskAssessment", "reported")}
                                    >
                                        <Button
                                            variant="danger"
                                            className="d-flex align-items-center"
                                            onClick={() => handleSectionStatus("riskAssessment", "reported")}
                                        >
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> Reportar
                                        </Button>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    )}
                </Card>

                {/* Sección de Observaciones Finales */}
                <Card style={styles.card}>
                    <div
                        style={styles.cardHeader}
                        onClick={() => toggleSection("finalObservations")}
                    >
                        <h2>4. Observaciones Finales</h2>
                        <span>{sections.finalObservations.showDetails ? '▲' : '▼'}</span>
                    </div>

                    {sections.finalObservations.showDetails && (
                        <Card.Body>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Comentarios Generales</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            value={sections.finalObservations.comments}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleCommentChange(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    )}
                </Card>

                {/* Sección de Aprobación */}
                <Card style={styles.card}>
                    <div
                        style={styles.cardHeader}
                        onClick={() => toggleSection("approval")}
                    >
                        <h2>5. Aprobación</h2>
                        <span>{sections.approval.showDetails ? '▲' : '▼'}</span>
                    </div>

                    {sections.approval.showDetails && (
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Empresa</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={sections.approval.company}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleApprovalChange("company", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Cargo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={sections.approval.position}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleApprovalChange("position", e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    )}
                </Card>

                {/* Botones de acción */}
                <div style={styles.buttonContainer}>
                    <Button variant="outline-secondary" onClick={handleSaveDraft}>
                        <Button
                            variant="outline-secondary"
                            className="d-flex align-items-center"
                            onClick={handleSaveDraft}
                        >
                            <FontAwesomeIcon icon={faSave} className="me-2" /> Guardar Borrador
                        </Button>
                    </Button>
                    <Button variant="primary" type="submit">
                        <Button
                            variant="primary"
                            type="submit"
                            className="d-flex align-items-center"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="me-2" /> Enviar Evaluación
                        </Button>
                    </Button>
                </div>
            </Form>

            {/* Toast de mensajes */}
            <ToastContainer position="bottom-end">
                <Toast onClose={closeToast} show={formStatus.showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Mensaje</strong>
                    </Toast.Header>
                    <Toast.Body>{formStatus.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}

export default Home;
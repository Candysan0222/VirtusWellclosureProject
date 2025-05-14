import React, { useState } from "react";
import { Navbar } from "react-bootstrap";
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
  ToastContainer
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faExclamationTriangle,
  faPaperPlane,
  faSave,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
// import Navbar from "./servicios/componentes/Navbar";

// Definición de tipos para mejorar mantenibilidad
type SectionStatus = null | "approved" | "reported";

interface LocationData {
  latitude: string;
  longitude: string;
}

interface ParameterData {
  before: string;
  during: string;
  after: string;
}

interface MitigationData {
  description: string;
  implementationDate: string;
}

interface GeneralInfoData {
  wellName: string;
  wellCode: string;
  location: LocationData;
  fieldBlock: string;
  operator: string;
  regulator: string;
  monitoringStartDate: string;
  monitoringEndDate: string;
  wellStatus: string;
}

interface WaterSoilParametersData {
  waterPh: ParameterData;
  electricalConductivity: ParameterData;
  hydrocarbonsInWater: ParameterData;
  metalContaminants: ParameterData;
  totalHydrocarbonsInSoil: ParameterData;
  volatileOrganicCompounds: ParameterData;
}

interface GasEmissionsData {
  co2Emission: ParameterData;
  ch4Emission: ParameterData;
  sulfurCompounds: ParameterData;
  nitrogenOxides: ParameterData;
  suspendedParticles: ParameterData;
}

interface MitigationMeasuresData {
  atmosphericEmissionsControl: MitigationData;
  contaminatedWaterTreatment: MitigationData;
  soilRestoration: MitigationData;
  hydrocarbonContainmentBarriers: MitigationData;
  areaRevegetation: MitigationData;
}

interface FinalObservationsData {
  comments: string;
  signature: string | null;
  reportDate: string;
  regulatoryApproval: string;
  showDetails: boolean;
}

interface SectionWithStatus<T> {
  status: SectionStatus;
  observation: string;
  data: T;
  showDetails: boolean;
}

interface FormSections {
  generalInfo: SectionWithStatus<GeneralInfoData>;
  waterSoilParameters: SectionWithStatus<WaterSoilParametersData>;
  gasEmissions: SectionWithStatus<GasEmissionsData>;
  mitigationMeasures: SectionWithStatus<MitigationMeasuresData>;
  finalObservations: FinalObservationsData;
}

interface FormStatus {
  isSubmitted: boolean;
  isComplete: boolean;
  showToast: boolean;
  message: string;
}

const Ambi = (): React.ReactElement => {
  // Main state for form sections
  const [sections, setSections] = useState<FormSections>({
    generalInfo: {
      status: null, // null, "approved", "reported"
      observation: "",
      data: {
        wellName: "",
        wellCode: "",
        location: {
          latitude: "",
          longitude: ""
        },
        fieldBlock: "",
        operator: "",
        regulator: "",
        monitoringStartDate: "",
        monitoringEndDate: "",
        wellStatus: ""
      },
      showDetails: true
    },
    waterSoilParameters: {
      status: null,
      observation: "",
      data: {
        waterPh: {
          before: "",
          during: "",
          after: ""
        },
        electricalConductivity: {
          before: "",
          during: "",
          after: ""
        },
        hydrocarbonsInWater: {
          before: "",
          during: "",
          after: ""
        },
        metalContaminants: {
          before: "",
          during: "",
          after: ""
        },
        totalHydrocarbonsInSoil: {
          before: "",
          during: "",
          after: ""
        },
        volatileOrganicCompounds: {
          before: "",
          during: "",
          after: ""
        }
      },
      showDetails: true
    },
    gasEmissions: {
      status: null,
      observation: "",
      data: {
        co2Emission: {
          before: "",
          during: "",
          after: ""
        },
        ch4Emission: {
          before: "",
          during: "",
          after: ""
        },
        sulfurCompounds: {
          before: "",
          during: "",
          after: ""
        },
        nitrogenOxides: {
          before: "",
          during: "",
          after: ""
        },
        suspendedParticles: {
          before: "",
          during: "",
          after: ""
        }
      },
      showDetails: true
    },
    mitigationMeasures: {
      status: null,
      observation: "",
      data: {
        atmosphericEmissionsControl: {
          description: "",
          implementationDate: ""
        },
        contaminatedWaterTreatment: {
          description: "",
          implementationDate: ""
        },
        soilRestoration: {
          description: "",
          implementationDate: ""
        },
        hydrocarbonContainmentBarriers: {
          description: "",
          implementationDate: ""
        },
        areaRevegetation: {
          description: "",
          implementationDate: ""
        }
      },
      showDetails: true
    },
    finalObservations: {
      comments: "",
      signature: null,
      reportDate: "",
      regulatoryApproval: "",
      showDetails: true
    }
  });

  const [formStatus, setFormStatus] = useState<FormStatus>({
    isSubmitted: false,
    isComplete: false,
    showToast: false,
    message: ""
  });

  // Handle section status changes (approval/report)
  const handleSectionStatus = (section: keyof Omit<FormSections, 'finalObservations'>, status: "approved" | "reported"): void => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        status: status
      }
    }));
  };

  // Handle text inputs for section observations
  const handleObservationChange = (section: keyof Omit<FormSections, 'finalObservations'>, value: string): void => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        observation: value
      }
    }));
  };

  // Handle general info data changes
  const handleGeneralInfoChange = (field: keyof GeneralInfoData, value: string): void => {
    setSections(prev => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        data: {
          ...prev.generalInfo.data,
          [field]: value
        }
      }
    }));
  };

  // Handle location data changes
  const handleLocationChange = (field: keyof LocationData, value: string): void => {
    setSections(prev => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        data: {
          ...prev.generalInfo.data,
          location: {
            ...prev.generalInfo.data.location,
            [field]: value
          }
        }
      }
    }));
  };

  // Handle water/soil parameter changes
  const handleParameterChange = (
      parameter: keyof WaterSoilParametersData,
      stage: keyof ParameterData,
      value: string
  ): void => {
    setSections(prev => ({
      ...prev,
      waterSoilParameters: {
        ...prev.waterSoilParameters,
        data: {
          ...prev.waterSoilParameters.data,
          [parameter]: {
            ...prev.waterSoilParameters.data[parameter],
            [stage]: value
          }
        }
      }
    }));
  };

  // Handle gas emissions changes
  const handleEmissionChange = (
      emission: keyof GasEmissionsData,
      stage: keyof ParameterData,
      value: string
  ): void => {
    setSections(prev => ({
      ...prev,
      gasEmissions: {
        ...prev.gasEmissions,
        data: {
          ...prev.gasEmissions.data,
          [emission]: {
            ...prev.gasEmissions.data[emission],
            [stage]: value
          }
        }
      }
    }));
  };

  // Handle mitigation measures changes
  const handleMitigationChange = (
      measure: keyof MitigationMeasuresData,
      field: keyof MitigationData,
      value: string
  ): void => {
    setSections(prev => ({
      ...prev,
      mitigationMeasures: {
        ...prev.mitigationMeasures,
        data: {
          ...prev.mitigationMeasures.data,
          [measure]: {
            ...prev.mitigationMeasures.data[measure],
            [field]: value
          }
        }
      }
    }));
  };

  // Handle final observations changes
  const handleFinalObservationsChange = (
      field: keyof Omit<FinalObservationsData, 'showDetails'>,
      value: string | null
  ): void => {
    setSections(prev => ({
      ...prev,
      finalObservations: {
        ...prev.finalObservations,
        [field]: value
      }
    }));
  };

  // Toggle section visibility
  const toggleSection = (section: keyof FormSections): void => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        showDetails: !prev[section].showDetails
      }
    }));
  };

  // Submit form handler
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    // Check if all required sections are approved
    const requiredSections: Array<keyof Omit<FormSections, 'finalObservations'>> = [
      'generalInfo',
      'waterSoilParameters',
      'gasEmissions',
      'mitigationMeasures'
    ];

    const allSectionsReviewed = requiredSections.every(section =>
        sections[section].status !== null
    );

    // Check if final observations are filled
    const finalObservationsComplete = Boolean(
        sections.finalObservations.comments &&
        sections.finalObservations.reportDate &&
        sections.finalObservations.regulatoryApproval
    );

    if (!allSectionsReviewed) {
      setFormStatus({
        ...formStatus,
        showToast: true,
        message: "Debe revisar y aprobar o reportar todas las secciones."
      });
      return;
    }

    if (!finalObservationsComplete) {
      setFormStatus({
        ...formStatus,
        showToast: true,
        message: "Debe completar la información de observaciones finales."
      });
      return;
    }

    // If all checks pass, submit the form
    console.log("Formulario enviado con éxito:", sections);
    setFormStatus({
      isSubmitted: true,
      isComplete: true,
      showToast: true,
      message: "Formulario enviado con éxito."
    });
  };

  // Save draft handler
  const handleSaveDraft = (): void => {
    console.log("Guardando borrador:", sections);
    setFormStatus({
      ...formStatus,
      showToast: true,
      message: "Borrador guardado con éxito."
    });
  };

  // Render status badge based on section status
  const renderStatusBadge = (status: SectionStatus): React.ReactElement => {
    if (status === null) return <Badge bg="secondary">Pendiente</Badge>;
    if (status === "approved") return <Badge bg="success">Aprobado</Badge>;
    return <Badge bg="danger">Reportado</Badge>;
  };

  // Close toast message
  const closeToast = (): void => {
    setFormStatus({
      ...formStatus,
      showToast: false
    });
  };

  // Helper function to calculate progress percentage
  const calculateProgress = (): number => {
    const requiredSections: Array<keyof Omit<FormSections, 'finalObservations'>> = [
      'generalInfo',
      'waterSoilParameters',
      'gasEmissions',
      'mitigationMeasures'
    ];
    const reviewedSections = requiredSections.filter(section => sections[section].status !== null).length;
    return Math.round((reviewedSections / requiredSections.length) * 100);
  };

  // Helper function to determine progress bar color
  const getProgressBarColor = (): string => {
    const progress = calculateProgress();
    if (progress < 33) return "bg-danger";
    if (progress < 100) return "bg-warning";
    return "bg-success";
  };

  return (
      <Container fluid className="px-4 py-3">
        <Navbar />

        {/* Toast notifications */}
        <ToastContainer className="p-3" position="top-end">
          <Toast show={formStatus.showToast} onClose={closeToast} delay={3000} autohide>
            <Toast.Header>
              <strong className="me-auto">Notificación</strong>
            </Toast.Header>
            <Toast.Body>{formStatus.message}</Toast.Body>
          </Toast>
        </ToastContainer>

        {/* Header and Dashboard Overview */}
        <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
          <div>
            <h1 className="fw-bold">Monitoreo Ambiental en la Suspensión y Abandono de Pozos</h1>
            <p className="text-muted">Revise y apruebe o reporte la información del monitoreo ambiental para pozos en suspensión o abandono.</p>
          </div>
        </div>

        {/* Progress indicator */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="card-title">Estado de la Revisión</h5>
            <div className="progress">
              <div
                  className={`progress-bar ${getProgressBarColor()}`}
                  role="progressbar"
                  style={{ width: `${calculateProgress()}%` }}
                  aria-valuenow={calculateProgress()}
                  aria-valuemin={0}
                  aria-valuemax={100}
              >
                {calculateProgress()}%
              </div>
            </div>
            <Row className="mt-3">
              <Col md={4} className="d-flex align-items-center">
                <div className="rounded-circle bg-secondary p-2 me-2" style={{width: "10px", height: "10px"}}></div>
                <small>Pendiente</small>
              </Col>
              <Col md={4} className="d-flex align-items-center">
                <div className="rounded-circle bg-success p-2 me-2" style={{width: "10px", height: "10px"}}></div>
                <small>Aprobado</small>
              </Col>
              <Col md={4} className="d-flex align-items-center">
                <div className="rounded-circle bg-danger p-2 me-2" style={{width: "10px", height: "10px"}}></div>
                <small>Reportado</small>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Main form */}
        <Form onSubmit={handleSubmit}>
          {/* 1. General Information Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Header
                className="d-flex justify-content-between align-items-center bg-light"
                onClick={() => toggleSection("generalInfo")}
                style={{ cursor: "pointer" }}
            >
              <div>
                <h5 className="mb-0">1. Información General del Pozo</h5>
                {renderStatusBadge(sections.generalInfo.status)}
              </div>
              <div>
              <span className="text-primary">
                {sections.generalInfo.showDetails ? "▲" : "▼"}
              </span>
              </div>
            </Card.Header>

            {sections.generalInfo.showDetails && (
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre del Pozo</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresado por el operador"
                            value={sections.generalInfo.data.wellName}
                            onChange={(e) => handleGeneralInfoChange("wellName", e.target.value)}
                            readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Código del Pozo</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresado por el operador"
                            value={sections.generalInfo.data.wellCode}
                            onChange={(e) => handleGeneralInfoChange("wellCode", e.target.value)}
                            readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ubicación (Latitud)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Latitud"
                            value={sections.generalInfo.data.location.latitude}
                            onChange={(e) => handleLocationChange("latitude", e.target.value)}
                            readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ubicación (Longitud)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Longitud"
                            value={sections.generalInfo.data.location.longitude}
                            onChange={(e) => handleLocationChange("longitude", e.target.value)}
                            readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Campo/Bloque</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresado por el operador"
                            value={sections.generalInfo.data.fieldBlock}
                            onChange={(e) => handleGeneralInfoChange("fieldBlock", e.target.value)}
                            readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Operador Responsable</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresado por el operador"
                            value={sections.generalInfo.data.operator}
                            onChange={(e) => handleGeneralInfoChange("operator", e.target.value)}
                            readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Entidad Reguladora Correspondiente</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresado por el operador"
                            value={sections.generalInfo.data.regulator}
                            onChange={(e) => handleGeneralInfoChange("regulator", e.target.value)}
                            readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de Inicio del Monitoreo</Form.Label>
                        <Form.Control
                            type="date"
                            value={sections.generalInfo.data.monitoringStartDate}
                            onChange={(e) => handleGeneralInfoChange("monitoringStartDate", e.target.value)}
                            readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de Finalización del Monitoreo</Form.Label>
                        <Form.Control
                            type="date"
                            value={sections.generalInfo.data.monitoringEndDate}
                            onChange={(e) => handleGeneralInfoChange("monitoringEndDate", e.target.value)}
                            readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Estado del Pozo</Form.Label>
                        <div>
                          <Form.Check
                              inline
                              label="En suspensión"
                              name="wellStatus"
                              type="checkbox"
                              id="status-suspension"
                              checked={sections.generalInfo.data.wellStatus === "En suspensión"}
                              onChange={() => {}}
                              disabled
                          />
                          <Form.Check
                              inline
                              label="En proceso de abandono"
                              name="wellStatus"
                              type="checkbox"
                              id="status-abandoning"
                              checked={sections.generalInfo.data.wellStatus === "En proceso de abandono"}
                              onChange={() => {}}
                              disabled
                          />
                          <Form.Check
                              inline
                              label="Abandonado"
                              name="wellStatus"
                              type="checkbox"
                              id="status-abandoned"
                              checked={sections.generalInfo.data.wellStatus === "Abandonado"}
                              onChange={() => {}}
                              disabled
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="supervisor-actions mt-4">
                    <div className="d-flex gap-3 mb-3">
                      <Button
                          variant="success"
                          className="d-flex align-items-center"
                          onClick={() => handleSectionStatus("generalInfo", "approved")}
                      >
                        <FontAwesomeIcon icon={faCheck} className="me-2" /> Aprobar
                      </Button>
                      <Button
                          variant="danger"
                          className="d-flex align-items-center"
                          onClick={() => handleSectionStatus("generalInfo", "reported")}
                      >
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> Reportar
                      </Button>
                    </div>
                    {sections.generalInfo.status && (
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Observación - <strong>{sections.generalInfo.status === "approved" ? "Aprobado" : "Reportado"}</strong>
                          </Form.Label>
                          <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Escriba su observación"
                              value={sections.generalInfo.observation}
                              onChange={(e) => handleObservationChange("generalInfo", e.target.value)}
                              required
                          />
                        </Form.Group>
                    )}
                  </div>
                </Card.Body>
            )}
          </Card>

          {/* 2. Water and Soil Parameters Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Header
                className="d-flex justify-content-between align-items-center bg-light"
                onClick={() => toggleSection("waterSoilParameters")}
                style={{ cursor: "pointer" }}
            >
              <div>
                <h5 className="mb-0">2. Parámetros de Calidad del Agua y Suelo</h5>
                {renderStatusBadge(sections.waterSoilParameters.status)}
              </div>
              <div>
              <span className="text-primary">
                {sections.waterSoilParameters.showDetails ? "▲" : "▼"}
              </span>
              </div>
            </Card.Header>

            {sections.waterSoilParameters.showDetails && (
                <Card.Body>
                  <table className="table table-bordered">
                    <thead>
                    <tr>
                      <th>Parámetro</th>
                      <th>Unidad de Medida</th>
                      <th>Antes del Abandono</th>
                      <th>Durante el Abandono</th>
                      <th>Después del Abandono</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>pH del Agua</td>
                      <td>Escala pH</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.waterPh.before}
                            onChange={(e) => handleParameterChange("waterPh", "before", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.waterPh.during}
                            onChange={(e) => handleParameterChange("waterPh", "during", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.waterPh.after}
                            onChange={(e) => handleParameterChange("waterPh", "after", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Conductividad Eléctrica</td>
                      <td>μS/cm</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.electricalConductivity.before}
                            onChange={(e) => handleParameterChange("electricalConductivity", "before", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.electricalConductivity.during}
                            onChange={(e) => handleParameterChange("electricalConductivity", "during", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.electricalConductivity.after}
                            onChange={(e) => handleParameterChange("electricalConductivity", "after", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Presencia de Hidrocarburos en Agua</td>
                      <td>mg/L</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.hydrocarbonsInWater.before}
                            onChange={(e) => handleParameterChange("hydrocarbonsInWater", "before", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.hydrocarbonsInWater.during}
                            onChange={(e) => handleParameterChange("hydrocarbonsInWater", "during", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.hydrocarbonsInWater.after}
                            onChange={(e) => handleParameterChange("hydrocarbonsInWater", "after", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Contaminantes Metálicos en Agua</td>
                      <td>mg/L</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.metalContaminants.before}
                            onChange={(e) => handleParameterChange("metalContaminants", "before", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.metalContaminants.during}
                            onChange={(e) => handleParameterChange("metalContaminants", "during", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.metalContaminants.after}
                            onChange={(e) => handleParameterChange("metalContaminants", "after", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Hidrocarburos Totales en Suelo</td>
                      <td>mg/Kg</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.totalHydrocarbonsInSoil.before}
                            onChange={(e) => handleParameterChange("totalHydrocarbonsInSoil", "before", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.totalHydrocarbonsInSoil.during}
                            onChange={(e) => handleParameterChange("totalHydrocarbonsInSoil", "during", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.totalHydrocarbonsInSoil.after}
                            onChange={(e) => handleParameterChange("totalHydrocarbonsInSoil", "after", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Compuestos Orgánicos Volátiles</td>
                      <td>ppm</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.volatileOrganicCompounds.before}
                            onChange={(e) => handleParameterChange("volatileOrganicCompounds", "before", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.volatileOrganicCompounds.during}
                            onChange={(e) => handleParameterChange("volatileOrganicCompounds", "during", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.waterSoilParameters.data.volatileOrganicCompounds.after}
                            onChange={(e) => handleParameterChange("volatileOrganicCompounds", "after", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    </tbody>
                  </table>

                  <div className="supervisor-actions mt-4">
                    <div className="d-flex gap-3 mb-3">
                      <Button
                          variant="success"
                          className="d-flex align-items-center"
                          onClick={() => handleSectionStatus("waterSoilParameters", "approved")}
                      >
                        <FontAwesomeIcon icon={faCheck} className="me-2" /> Aprobar
                      </Button>
                      <Button
                          variant="danger"
                          className="d-flex align-items-center"
                          onClick={() => handleSectionStatus("waterSoilParameters", "reported")}
                      >
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> Reportar
                      </Button>
                    </div>
                    {sections.waterSoilParameters.status && (
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Observación - <strong>{sections.waterSoilParameters.status === "approved" ? "Aprobado" : "Reportado"}</strong>
                          </Form.Label>
                          <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Escriba su observación"
                              value={sections.waterSoilParameters.observation}
                              onChange={(e) => handleObservationChange("waterSoilParameters", e.target.value)}
                              required
                          />
                        </Form.Group>
                    )}
                  </div>
                </Card.Body>
            )}
          </Card>

          {/* 3. Gas Emissions Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Header
                className="d-flex justify-content-between align-items-center bg-light"
                onClick={() => toggleSection("gasEmissions")}
                style={{ cursor: "pointer" }}
            >
              <div>
                <h5 className="mb-0">3. Registros de Emisiones de Gases y Contaminantes</h5>
                {renderStatusBadge(sections.gasEmissions.status)}
              </div>
              <div>
              <span className="text-primary">
                {sections.gasEmissions.showDetails ? "▲" : "▼"}
              </span>
              </div>
            </Card.Header>

            {sections.gasEmissions.showDetails && (
                <Card.Body>
                  <table className="table table-bordered">
                    <thead>
                    <tr>
                      <th>Tipo de Emisión</th>
                      <th>Unidad de Medida</th>
                      <th>Antes del Abandono</th>
                      <th>Durante el Abandono</th>
                      <th>Después del Abandono</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Emisión de CO2</td>
                      <td>ppm</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.co2Emission.before}
                            onChange={(e) => handleEmissionChange("co2Emission", "before", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.co2Emission.during}
                            onChange={(e) => handleEmissionChange("co2Emission", "during", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.co2Emission.after}
                            onChange={(e) => handleEmissionChange("co2Emission", "after", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Emisión de CH4</td>
                      <td>ppm</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.ch4Emission.before}
                            onChange={(e) => handleEmissionChange("ch4Emission", "before", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.ch4Emission.during}
                            onChange={(e) => handleEmissionChange("ch4Emission", "during", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.ch4Emission.after}
                            onChange={(e) => handleEmissionChange("ch4Emission", "after", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Compuestos de Azufre (SOx)</td>
                      <td>ppm</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.sulfurCompounds.before}
                            onChange={(e) => handleEmissionChange("sulfurCompounds", "before", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.sulfurCompounds.during}
                            onChange={(e) => handleEmissionChange("sulfurCompounds", "during", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.sulfurCompounds.after}
                            onChange={(e) => handleEmissionChange("sulfurCompounds", "after", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Óxidos de Nitrógeno (NOx)</td>
                      <td>ppm</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.nitrogenOxides.before}
                            onChange={(e) => handleEmissionChange("nitrogenOxides", "before", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.nitrogenOxides.during}
                            onChange={(e) => handleEmissionChange("nitrogenOxides", "during", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.nitrogenOxides.after}
                            onChange={(e) => handleEmissionChange("nitrogenOxides", "after", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Partículas Suspendidas (PM10, PM2.5)</td>
                      <td>μg/m3</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.suspendedParticles.before}
                            onChange={(e) => handleEmissionChange("suspendedParticles", "before", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.suspendedParticles.during}
                            onChange={(e) => handleEmissionChange("suspendedParticles", "during", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={sections.gasEmissions.data.suspendedParticles.after}
                            onChange={(e) => handleEmissionChange("suspendedParticles", "after", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    </tbody>
                  </table>

                  <div className="supervisor-actions mt-4">
                    <div className="d-flex gap-3 mb-3">
                      <Button
                          variant="success"
                          className="d-flex align-items-center"
                          onClick={() => handleSectionStatus("gasEmissions", "approved")}
                      >
                        <FontAwesomeIcon icon={faCheck} className="me-2" /> Aprobar
                      </Button>
                      <Button
                          variant="danger"
                          className="d-flex align-items-center"
                          onClick={() => handleSectionStatus("gasEmissions", "reported")}
                      >
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> Reportar
                      </Button>
                    </div>
                    {sections.gasEmissions.status && (
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Observación - <strong>{sections.gasEmissions.status === "approved" ? "Aprobado" : "Reportado"}</strong>
                          </Form.Label>
                          <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Escriba su observación"
                              value={sections.gasEmissions.observation}
                              onChange={(e) => handleObservationChange("gasEmissions", e.target.value)}
                              required
                          />
                        </Form.Group>
                    )}
                  </div>
                </Card.Body>
            )}
          </Card>

          {/* 4. Mitigation Measures Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Header
                className="d-flex justify-content-between align-items-center bg-light"
                onClick={() => toggleSection("mitigationMeasures")}
                style={{ cursor: "pointer" }}
            >
              <div>
                <h5 className="mb-0">4. Medidas de Mitigación Implementadas</h5>
                {renderStatusBadge(sections.mitigationMeasures.status)}
              </div>
              <div>
              <span className="text-primary">
                {sections.mitigationMeasures.showDetails ? "▲" : "▼"}
              </span>
              </div>
            </Card.Header>

            {sections.mitigationMeasures.showDetails && (
                <Card.Body>
                  <table className="table table-bordered">
                    <thead>
                    <tr>
                      <th>Medida</th>
                      <th>Descripción</th>
                      <th>Fecha de Implementación</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Control de Emisiones Atmosféricas</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Descripción"
                            value={sections.mitigationMeasures.data.atmosphericEmissionsControl.description}
                            onChange={(e) => handleMitigationChange("atmosphericEmissionsControl", "description", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="date"
                            value={sections.mitigationMeasures.data.atmosphericEmissionsControl.implementationDate}
                            onChange={(e) => handleMitigationChange("atmosphericEmissionsControl", "implementationDate", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Tratamiento de Aguas Contaminadas</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Descripción"
                            value={sections.mitigationMeasures.data.contaminatedWaterTreatment.description}
                            onChange={(e) => handleMitigationChange("contaminatedWaterTreatment", "description", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="date"
                            value={sections.mitigationMeasures.data.contaminatedWaterTreatment.implementationDate}
                            onChange={(e) => handleMitigationChange("contaminatedWaterTreatment", "implementationDate", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Restauración del Suelo</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Descripción"
                            value={sections.mitigationMeasures.data.soilRestoration.description}
                            onChange={(e) => handleMitigationChange("soilRestoration", "description", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="date"
                            value={sections.mitigationMeasures.data.soilRestoration.implementationDate}
                            onChange={(e) => handleMitigationChange("soilRestoration", "implementationDate", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Barreras de Contención para Hidrocarburos</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Descripción"
                            value={sections.mitigationMeasures.data.hydrocarbonContainmentBarriers.description}
                            onChange={(e) => handleMitigationChange("hydrocarbonContainmentBarriers", "description", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="date"
                            value={sections.mitigationMeasures.data.hydrocarbonContainmentBarriers.implementationDate}
                            onChange={(e) => handleMitigationChange("hydrocarbonContainmentBarriers", "implementationDate", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Revegetación de la Zona</td>
                      <td>
                        <Form.Control
                            type="text"
                            placeholder="Descripción"
                            value={sections.mitigationMeasures.data.areaRevegetation.description}
                            onChange={(e) => handleMitigationChange("areaRevegetation", "description", e.target.value)}
                            readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                            type="date"
                            value={sections.mitigationMeasures.data.areaRevegetation.implementationDate}
                            onChange={(e) => handleMitigationChange("areaRevegetation", "implementationDate", e.target.value)}
                            readOnly
                        />
                      </td>
                    </tr>
                    </tbody>
                  </table>

                  <div className="supervisor-actions mt-4">
                    <div className="d-flex gap-3 mb-3">
                      <Button
                          variant="success"
                          className="d-flex align-items-center"
                          onClick={() => handleSectionStatus("mitigationMeasures", "approved")}
                      >
                        <FontAwesomeIcon icon={faCheck} className="me-2" /> Aprobar
                      </Button>
                      <Button
                          variant="danger"
                          className="d-flex align-items-center"
                          onClick={() => handleSectionStatus("mitigationMeasures", "reported")}
                      >
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> Reportar
                      </Button>
                    </div>
                    {sections.mitigationMeasures.status && (
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Observación - <strong>{sections.mitigationMeasures.status === "approved" ? "Aprobado" : "Reportado"}</strong>
                          </Form.Label>
                          <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Escriba su observación"
                              value={sections.mitigationMeasures.observation}
                              onChange={(e) => handleObservationChange("mitigationMeasures", e.target.value)}
                              required
                          />
                        </Form.Group>
                    )}
                  </div>
                </Card.Body>
            )}
          </Card>

          {/* 5. Final Observations Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Header
                className="d-flex justify-content-between align-items-center bg-light"
                onClick={() => toggleSection("finalObservations")}
                style={{ cursor: "pointer" }}
            >
              <div>
                <h5 className="mb-0">5. Observaciones Finales</h5>
              </div>
              <div>
              <span className="text-primary">
                {sections.finalObservations.showDetails ? "▲" : "▼"}
              </span>
              </div>
            </Card.Header>

            {sections.finalObservations.showDetails && (
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Comentarios Adicionales</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Ingrese comentarios adicionales sobre el estado general del pozo y el cumplimiento ambiental"
                            value={sections.finalObservations.comments}
                            onChange={(e) => handleFinalObservationsChange("comments", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de Presentación del Reporte</Form.Label>
                        <Form.Control
                            type="date"
                            value={sections.finalObservations.reportDate}
                            onChange={(e) => handleFinalObservationsChange("reportDate", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Aprobación de la Entidad Reguladora</Form.Label>
                        <Form.Select
                            value={sections.finalObservations.regulatoryApproval}
                            onChange={(e) => handleFinalObservationsChange("regulatoryApproval", e.target.value)}
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="Aprobado">Aprobado</option>
                          <option value="Rechazado">Rechazado</option>
                          <option value="Requiere revisión">Requiere revisión</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <div className="mb-3">
                        <Form.Label>Firma del Supervisor Ambiental</Form.Label>
                        <div className="border rounded p-3 text-center" style={{ height: "100px" }}>
                          {sections.finalObservations.signature ? (
                              <p className="text-success">Firma registrada</p>
                          ) : (
                              <Button
                                  variant="outline-secondary"
                                  className="d-flex align-items-center mx-auto"
                                  onClick={() => handleFinalObservationsChange("signature", "firmado")}
                              >
                                <FontAwesomeIcon icon={faUpload} className="me-2" /> Cargar Firma
                              </Button>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
            )}
          </Card>

          {/* Submit Section */}
          <div className="text-center mb-5">
            <Button
                variant="primary"
                size="lg"
                type="submit"
                className="px-5 py-2 d-flex align-items-center mx-auto"
                disabled={formStatus.isSubmitted}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
              {formStatus.isSubmitted ? "Enviado" : "Enviar Aprobación Final"}
            </Button>

            <Button
                variant="secondary"
                size="lg"
                type="button"
                className="mt-3 px-5 py-2 d-flex align-items-center mx-auto"
                onClick={handleSaveDraft}
            >
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Guardar Borrador
            </Button>

            {formStatus.isSubmitted && (
                <Alert variant="success" className="mt-3">
                  El formulario ha sido enviado con éxito.
                </Alert>
            )}
          </div>
        </Form>
      </Container>
  );
};

export default Ambi;
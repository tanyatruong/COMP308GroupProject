import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Form,
  Button,
  InputGroup,
  Spinner,
  Alert,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import {
  Star,
  StarFill,
  Search,
  GeoAlt,
  Tag,
  Calendar,
  Shop,
  ArrowLeft,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { format, isValid } from "date-fns";

import { GET_ALL_OFFERS, GET_BUSINESS_PROFILE_BY_ID } from "../../../graphql/queries";

const PublicMarketplace = () => {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [businessProfiles, setBusinessProfiles] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [availableTags, setAvailableTags] = useState([]);

  const { loading: offersLoading, error: offersError, data: offersData } = useQuery(GET_ALL_OFFERS);
  const [fetchBusinessProfileQuery, { loading: profilesLoading }] = useLazyQuery(GET_BUSINESS_PROFILE_BY_ID);

  useEffect(() => {
    if (offersData && offersData.offers) {
      const activeOffers = offersData.offers.filter((offer) => offer.isActive);
      setOffers(activeOffers);
      setFilteredOffers(activeOffers);

      const uniqueBusinessIds = [...new Set(activeOffers.map((offer) => offer.business?.id).filter(Boolean))];
      fetchBusinessProfiles(uniqueBusinessIds);
    }
  }, [offersData]);

  const fetchBusinessProfiles = async (businessIds) => {
    if (!businessIds.length) return;
    const newProfiles = { ...businessProfiles };

    try {
      for (const id of businessIds) {
        const { data } = await fetchBusinessProfileQuery({ variables: { businessId: id } });
        if (data?.businessProfile) {
          newProfiles[id] = data.businessProfile;
        }
      }
      setBusinessProfiles(newProfiles);

      const tagSet = new Set();
      Object.values(newProfiles).forEach((profile) => {
        profile.businessTags?.forEach((tag) => tagSet.add(tag));
      });
      setAvailableTags(Array.from(tagSet));
    } catch (err) {
      console.error("Error fetching business profiles:", err);
    }
  };

  useEffect(() => {
    let result = [...offers];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((offer) => {
        const profile = businessProfiles[offer.business?.id];
        return (
          offer.title?.toLowerCase().includes(searchLower) ||
          offer.content?.toLowerCase().includes(searchLower) ||
          profile?.businessName?.toLowerCase().includes(searchLower)
        );
      });
    }

    if (selectedTags.length > 0) {
      result = result.filter((offer) => {
        const profile = businessProfiles[offer.business?.id];
        return selectedTags.some((tag) => profile?.businessTags?.includes(tag));
      });
    }

    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "expiring-soon":
        result.sort((a, b) => (!a.expiresAt ? 1 : !b.expiresAt ? -1 : new Date(a.expiresAt) - new Date(b.expiresAt)));
        break;
      case "alphabetical":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      default:
        break;
    }

    setFilteredOffers(result);
  }, [offers, searchTerm, selectedTags, sortOption, businessProfiles]);

  const handleTagSelect = (tag) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(Number(timestamp));
    return isNaN(date.getTime()) ? "N/A" : format(date, "MM/dd/yyyy");
  };

  const renderStars = (rating = 0) => {
    const rounded = Math.round(rating);
    return [...Array(5)].map((_, i) =>
      i < rounded ? <StarFill key={i} className="text-warning" size={14} /> : <Star key={i} className="text-warning" size={14} />
    );
  };

  const getBusinessProfile = (offer) => businessProfiles[offer.business?.id];
  
  const navigateToBusinessDetails = (businessId) => {
    navigate(`/resident/marketplace/businessdetails/${businessId}`);
  };

  if (offersLoading || profilesLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading offers...</p>
      </Container>
    );
  }

  if (offersError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error loading offers: {offersError.message}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Top Bar */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">
            <Shop className="me-2" />
            Community Marketplace
          </h2>
          <p className="text-muted">Discover local business offers and promotions</p>
        </Col>
        <Col className="text-end">
          <Button variant="outline-primary" onClick={() => navigate("/residentdashboard")}>
            <ArrowLeft className="me-1" />
            Back to Dashboard
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={4} className="mb-2">
          <InputGroup>
            <InputGroup.Text><Search /></InputGroup.Text>
            <Form.Control
              placeholder="Search offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="mb-2">
          <DropdownButton id="tag-filter" title={<><Tag className="me-1" /> Filter by Tags</>} variant="outline-secondary">
            {availableTags.length ? (
              availableTags.map((tag) => (
                <Dropdown.Item
                  key={tag}
                  active={selectedTags.includes(tag)}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled>No tags available</Dropdown.Item>
            )}
            {selectedTags.length > 0 && <>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setSelectedTags([])}>Clear all filters</Dropdown.Item>
            </>}
          </DropdownButton>
        </Col>
        <Col md={4} className="mb-2">
          <DropdownButton id="sort-options" title={<><Calendar className="me-1" /> Sort By</>} variant="outline-secondary">
            <Dropdown.Item active={sortOption === "newest"} onClick={() => setSortOption("newest")}>Newest First</Dropdown.Item>
            <Dropdown.Item active={sortOption === "expiring-soon"} onClick={() => setSortOption("expiring-soon")}>Expiring Soon</Dropdown.Item>
            <Dropdown.Item active={sortOption === "alphabetical"} onClick={() => setSortOption("alphabetical")}>Alphabetical</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>

      {/* Active Tags */}
      {selectedTags.length > 0 && (
        <Row className="mb-3">
          <Col>
            <div className="d-flex flex-wrap align-items-center">
              <strong className="me-2">Active Filters:</strong>
              {selectedTags.map((tag) => (
                <Badge key={tag} bg="primary" className="me-2 mb-2" onClick={() => handleTagSelect(tag)} style={{ cursor: "pointer" }}>
                  {tag} &times;
                </Badge>
              ))}
              <Button size="sm" variant="link" onClick={() => setSelectedTags([])}>Clear all</Button>
            </div>
          </Col>
        </Row>
      )}

      {/* Offers */}
      <Row>
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => {
            const profile = getBusinessProfile(offer);
            return (
              <Col md={6} lg={4} key={offer.id} className="mb-4">
                <Card className="shadow-sm h-100">
                  {offer.expiresAt && new Date(offer.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                    <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-2">
                      Expires Soon
                    </Badge>
                  )}
                  <Card.Body>
                    <Card.Title className="fs-5">{offer.title || "Untitled Offer"}</Card.Title>
                    <div 
                      className="mb-3 p-2 bg-light rounded" 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => profile && navigateToBusinessDetails(profile.id)}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{profile?.businessName || "Unknown Business"}</h6>
                        {profile?.averageRating > 0 && (
                          <div className="d-flex align-items-center">
                            <small className="text-muted me-1">{profile.averageRating.toFixed(1)}</small>
                            {renderStars(profile.averageRating)}
                          </div>
                        )}
                      </div>
                      {profile?.location?.city && (
                        <div className="small mb-1 text-muted">
                          <GeoAlt className="me-1" size={14} />
                          {profile.location.city}
                          {profile.location.address && `, ${profile.location.address}`}
                        </div>
                      )}
                      <div className="mt-2">
                        {profile?.businessTags?.map((tag) => (
                          <Badge key={tag} bg="secondary" className="me-1 mb-1" onClick={(e) => {
                            e.stopPropagation(); // Prevent business profile navigation
                            handleTagSelect(tag);
                          }} style={{ cursor: "pointer" }}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Card.Text>{offer.content || "No description available."}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-between small text-muted bg-white border-top">
                    <span><Calendar size={14} className="me-1" />Created: {formatDate(offer.createdAt)}</span>
                    <span><strong>Expires:</strong> {formatDate(offer.expiresAt)}</span>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col>
            <Alert variant="info">No offers match your filters. Try adjusting your search.</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default PublicMarketplace;
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FileText, Search, Info, ArrowDown, ArrowUp, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function DocumentationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState([]); // Track expanded cards

  const documents = [
    { id: 1, title: "Birth Certificate", description: "Official civil registration for birth, required for school, citizenship, and passport applications.", requirements: ["Parent’s citizenship copy", "Marriage certificate of parents", "Hospital birth letter or witness letter"] },
    { id: 2, title: "Death Certificate", description: "Official civil registration to confirm death for legal and administrative purposes.", requirements: ["Copy of the deceased’s citizenship", "Hospital death report", "Ward recommendation letter"] },
    { id: 3, title: "Marriage Certificate", description: "Proof of legal marriage recognized by the ward office and government.", requirements: ["Citizenship copies of both partners", "Passport-size photos (2 each)", "Witness citizenship copies"] },
    { id: 4, title: "Migration Certificate", description: "Civil registration to confirm migration status.", requirements: ["Citizenship copy", "Proof of previous residence", "Application to ward office"] },
    { id: 5, title: "Residency / Address Verification", description: "Certifies your current residence/address for official purposes.", requirements: ["Citizenship copy", "Rental or property document", "Local ward recommendation"] },
    { id: 6, title: "Income / Occupation Verification", description: "Confirms your income and occupation for loans, scholarships, and other purposes.", requirements: ["Employer letter or payslip", "Citizenship copy", "Application form"] },
    { id: 7, title: "Relationship Verification Letter", description: "Used to prove relationship for inheritance, guardianship, or legal purposes.", requirements: ["Citizenship copies of involved parties", "Supporting documents for relationship", "Ward recommendation"] },
    { id: 8, title: "Tax Clearance Certificate", description: "Confirms local tax clearance for property, business, or individual taxes.", requirements: ["Tax payment receipts", "Citizenship copy", "Application to ward office"] },
  ];

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id) => {
    if (expandedCards.includes(id)) {
      setExpandedCards(expandedCards.filter((cardId) => cardId !== id));
    } else {
      setExpandedCards([...expandedCards, id]);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      {/* Header with Back Button */}
      <View className="flex-row items-center mt-6 mb-4">
        {/* Back Arrow */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")} // Navigate to home
          className="bg-[#003083] p-3 rounded-full"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>

        {/* Header Text */}
        <Text className="flex-1 text-2xl font-bold text-[#003083] text-center ml-2 mr-2">
          Need a Document?
        </Text>
      </View>

      {/* Subtitle */}
      <Text className="text-gray-600 text-center mb-5">
        Find requirements for civil, verification, and tax documents
      </Text>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white rounded-full shadow-md px-4 py-2 mb-5">
        <Search size={20} color="#003083" />
        <TextInput
          placeholder="Search documents..."
          className="flex-1 ml-2 text-base"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Document Cards */}
      {filteredDocs.length === 0 ? (
        <Text className="text-center text-gray-500 mt-10">
          No documents found.
        </Text>
      ) : (
        filteredDocs.map((doc) => {
          const isExpanded = expandedCards.includes(doc.id);

          return (
            <View
              key={doc.id}
              className="bg-white rounded-2xl shadow-md mb-6 p-4"
            >
              {/* Title */}
              <View className="flex-row items-center mb-2">
                <FileText size={20} color="#4F6F52" />
                <Text className="text-lg font-semibold ml-2">{doc.title}</Text>
              </View>

              {/* Description */}
              <Text className="text-sm text-gray-600 mb-3">{doc.description}</Text>

              {/* Requirements - Show only if expanded */}
              {isExpanded && (
                <View className="bg-[#4F6F52]/10 rounded-xl p-3 mb-3">
                  <View className="flex-row items-center mb-2">
                    <Info size={16} color="#4F6F52" />
                    <Text className="ml-1 text-[#4F6F52] font-medium">
                      Required Documents:
                    </Text>
                  </View>
                  {doc.requirements.map((req, index) => (
                    <Text key={index} className="text-gray-700 ml-4 mb-1">
                      • {req}
                    </Text>
                  ))}
                </View>
              )}

              {/* Expand/Collapse Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-[#003083] py-3 rounded-xl mt-1 flex-row items-center justify-center"
                onPress={() => toggleExpand(doc.id)}
              >
                <Text className="text-white font-medium mr-2">
                  {isExpanded ? "View Less" : "View More"}
                </Text>
                {isExpanded ? (
                  <ArrowUp size={18} color="white" />
                ) : (
                  <ArrowDown size={18} color="white" />
                )}
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

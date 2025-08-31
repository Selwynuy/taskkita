import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';

const MapSearchBar = ({ onLocationSelect, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    // Mock search results - replace with actual Google Places API
    const mockResults = [
      { id: '1', name: 'Barangay 1, Manila', coordinate: { latitude: 14.5995, longitude: 120.9842 } },
      { id: '2', name: 'Barangay 2, Manila', coordinate: { latitude: 14.6000, longitude: 120.9850 } },
      { id: '3', name: 'Barangay 3, Manila', coordinate: { latitude: 14.5980, longitude: 120.9830 } },
      { id: '4', name: 'Manila Bay', coordinate: { latitude: 14.5970, longitude: 120.9820 } },
    ].filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(mockResults);
    setIsSearching(false);
    
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleLocationSelect = (location) => {
    setSearchQuery(location.name);
    setSearchResults([]);
    setIsSearching(false);
    
    if (onLocationSelect) {
      onLocationSelect(location.coordinate);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResult}
      onPress={() => handleLocationSelect(item)}
    >
      <Ionicons name="location" size={16} color={colors.gray} />
      <Text style={styles.searchResultText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location..."
            placeholderTextColor={colors.gray}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={colors.gray} />
            </TouchableOpacity>
          )}
        </View>
        
        {isSearching && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}
      </View>

      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            style={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  searchContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    ...shadows.medium,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  resultsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    ...shadows.medium,
  },
  resultsList: {
    paddingVertical: 8,
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  searchResultText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
});

export default MapSearchBar;

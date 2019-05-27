import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingCircleFull = ({visible}) => (
    <View style={styles.indicatorBox}>
        <ActivityIndicator size="large" color="#eb3a3a" animating={visible} />
    </View>
);

const styles = StyleSheet.create({
    indicatorBox:{
        position:'absolute',
        justifyContent: 'center',
        width:'100%',
        height: '100%'
    }
});

export default LoadingCircleFull;

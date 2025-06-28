package com.hahn.demo.service.mapper;

import com.hahn.demo.domaine.User;
import com.hahn.demo.service.common.EntityMapper;
import com.hahn.demo.service.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper extends EntityMapper<UserDto, User> {

}